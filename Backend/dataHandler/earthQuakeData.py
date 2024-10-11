import requests

def getEarthData():
    url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=CWA-3D385D45-EFD5-4BD3-9677-9100AD39A4A2&limit=2"
    earthquakeData = requests.get(url,verify=False).json()["records"]["Earthquake"]
    resultData = []
    for i in range(len(earthquakeData)):
        resultData.append({
            "color":earthquakeData[i]["ReportColor"],
            "content":earthquakeData[i]["ReportContent"],
            "intensity":[]
        })
        shakeArea = earthquakeData[i]["Intensity"]["ShakingArea"]
        for j in range(len(shakeArea)):
            if not -shakeArea[j]["AreaDesc"].find("最"):
                del shakeArea[j]["EqStation"]
                resultData[i]["intensity"].append(shakeArea[j])
    return resultData
print(getEarthData())
