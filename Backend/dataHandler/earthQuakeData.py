import requests
from .methodPack import haversine,setLocate

url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=CWA-3D385D45-EFD5-4BD3-9677-9100AD39A4A2&limit=2"
testData = []
def getEarthDataFCM():
    earthquakeData = requests.get(url,verify=False).json()["records"]["Earthquake"]
    resultData = []

    for i in range(len(earthquakeData)):
        intensity = []
        shakeArea = earthquakeData[i]["Intensity"]["ShakingArea"]
        for nowElement in shakeArea:
                if not -nowElement["AreaDesc"].find("最"):
                    del nowElement["EqStation"]
                    intensity.append(nowElement)
                intensity = sorted(intensity, key=lambda x: int(x['AreaIntensity'][0]))
        resultData.append({
            "color":     earthquakeData[i]["ReportColor"],
            "content":   earthquakeData[i]["ReportContent"],
            "intensity": intensity
        })
    return resultData
def getEarthData2(lon,lat):
    return testData

def getEarthData(lon,lat):
    earthquakeData = requests.get(url,verify=False).json()["records"]["Earthquake"]
    resultData = []

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
                for name in nowElement["CountyName"].split('、'):
                    if name == setLocate(lat,lon)["city"]:AreaIntensity = nowElement["AreaIntensity"]
            intensity = sorted(intensity, key=lambda x: int(x['AreaIntensity'][0]))

        resultData.append({
            "color":     earthquakeData[i]["ReportColor"],
            "content":   earthquakeData[i]["ReportContent"],
            "reportImg": earthquakeData[i]["ReportImageURI"],
            "shakeImg":  earthquakeData[i]["ShakemapImageURI"],
            "time":      earthquakeData[i]["EarthquakeInfo"]["OriginTime"],
            "depth":     str(earthquakeData[i]["EarthquakeInfo"]["FocalDepth"]),
            "location":  earthquakeData[i]["EarthquakeInfo"]["Epicenter"]["Location"],
            "magnitude": str(earthquakeData[i]["EarthquakeInfo"]["EarthquakeMagnitude"]["MagnitudeValue"]),
            "distance":  haversine(lat,lon,shakeLat,shakeLon),
            "intensity": intensity,
            "nowLocationAlert":AreaIntensity if AreaIntensity else "該地區未列入最大震度範圍"
        })
    return resultData