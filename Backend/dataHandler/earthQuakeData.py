import requests
from .methodPack import haversine,setLocate

url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=CWA-3D385D45-EFD5-4BD3-9677-9100AD39A4A2&limit=2"
testData = []
def getEarthDataFCM():
    earthquakeData = requests.get(url,verify=False).json()["records"]["Earthquake"]
    resultData = []
    nowCity = "新北市"
    for i in range(len(earthquakeData)):
        AreaIntensity = ""
        shakeArea = earthquakeData[i]["Intensity"]["ShakingArea"]
        for nowElement in shakeArea:
                if not -nowElement["AreaDesc"].find("最"):
                    for name in nowElement["CountyName"].split('、'):
                        if name == nowCity:AreaIntensity = nowElement["AreaIntensity"]
        resultData.append({
            "color":                earthquakeData[i]["ReportColor"],
            "nowLocation":          nowCity,
            "content":              earthquakeData[i]["ReportContent"],
            "depth":                str(earthquakeData[i]["EarthquakeInfo"]["FocalDepth"]),
            "location":             earthquakeData[i]["EarthquakeInfo"]["Epicenter"]["Location"],
            "magnitude":            str(earthquakeData[i]["EarthquakeInfo"]["EarthquakeMagnitude"]["MagnitudeValue"]),
            "nowLocationIntensity": AreaIntensity
        })
    return resultData
def getEarthData2(lon,lat,city):
    return testData

def getEarthData(lon,lat,city):
    earthquakeData = requests.get(url,verify=False).json()["records"]["Earthquake"]
    resultData = []
    _city = city
    for i in range(len(earthquakeData)):
        shakeLon = earthquakeData[i]["EarthquakeInfo"]["Epicenter"]["EpicenterLongitude"]
        shakeLat = earthquakeData[i]["EarthquakeInfo"]["Epicenter"]["EpicenterLatitude"]
        intensity = []
        AreaIntensity = ""
        shakeArea = earthquakeData[i]["Intensity"]["ShakingArea"]
        for nowElement in shakeArea:
            if not -nowElement["AreaDesc"].find("最"):
                del nowElement["EqStation"]
                intensity.append(nowElement)
                if _city is None:
                    _city = setLocate(lat,lon)["city"]
                for name in nowElement["CountyName"].split('、'):
                    if name == _city:AreaIntensity = nowElement["AreaIntensity"]
            intensity = sorted(intensity, key=lambda x: int(x['AreaIntensity'][0]))

        resultData.append({
            "color":                earthquakeData[i]["ReportColor"],
            "content":              earthquakeData[i]["ReportContent"],
            "reportImg":            earthquakeData[i]["ReportImageURI"],
            "shakeImg":             earthquakeData[i]["ShakemapImageURI"],
            "time":                 earthquakeData[i]["EarthquakeInfo"]["OriginTime"],
            "depth":                str(earthquakeData[i]["EarthquakeInfo"]["FocalDepth"]),
            "location":             earthquakeData[i]["EarthquakeInfo"]["Epicenter"]["Location"],
            "magnitude":            str(earthquakeData[i]["EarthquakeInfo"]["EarthquakeMagnitude"]["MagnitudeValue"]),
            "distance":             haversine(lat,lon,shakeLat,shakeLon),
            "intensity":            intensity,
            "nowLocationIntensity": AreaIntensity if AreaIntensity else "該地區未列入最大震度範圍"
        })
    return resultData

#print(getEarthDataFCM())