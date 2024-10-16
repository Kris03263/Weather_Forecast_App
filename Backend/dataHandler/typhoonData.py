import requests

url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/W-C0034-005?Authorization=CWA-3D385D45-EFD5-4BD3-9677-9100AD39A4A2"

def getTyphoonData():
    typhoonData = requests.get(url).json()["records"]["tropicalCyclones"]["tropicalCyclone"]
    resultData = []

    for element in typhoonData:
        resultData.append({
            "name":element["typhoonName"],
            "cname":element["cwaTyphoonName"],
            "pastPosition":[x for x in element["analysisData"]["fix"]],
            "futurePosition":[x for x in element["forecastData"]["fix"]]
        })
    return resultData
