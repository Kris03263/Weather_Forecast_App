import requests,math

url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=CWA-3D385D45-EFD5-4BD3-9677-9100AD39A4A2&limit=2"

def getEarthDataFCM():
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
            resultData[i]["intensity"] = sorted(resultData[i]["intensity"], key=lambda x: int(x['AreaIntensity'][0]))
    
    return resultData

def getEarthData(lon,lat):
    earthquakeData = requests.get(url,verify=False).json()["records"]["Earthquake"]
    resultData = []

    for i in range(len(earthquakeData)):
        shakeLon = earthquakeData[i]["EarthquakeInfo"]["Epicenter"]["EpicenterLongitude"]
        shakeLat = earthquakeData[i]["EarthquakeInfo"]["Epicenter"]["EpicenterLatitude"]
        resultData.append({
            "color":earthquakeData[i]["ReportColor"],
            "content":earthquakeData[i]["ReportContent"],
            "reportImg":earthquakeData[i]["ReportImageURI"],
            "shakeImg":earthquakeData[i]["ShakemapImageURI"],
            "time":earthquakeData[i]["EarthquakeInfo"]["OriginTime"],
            "depth":str(earthquakeData[i]["EarthquakeInfo"]["FocalDepth"]),
            "location":earthquakeData[i]["EarthquakeInfo"]["Epicenter"]["Location"],
            "magnitude":str(earthquakeData[i]["EarthquakeInfo"]["EarthquakeMagnitude"]["MagnitudeValue"]),
            "distance":haversine(lat,lon,shakeLat,shakeLon),
            "intensity":[]
        })
        
        shakeArea = earthquakeData[i]["Intensity"]["ShakingArea"]
        for j in range(len(shakeArea)):
            if not -shakeArea[j]["AreaDesc"].find("最"):
                del shakeArea[j]["EqStation"]
                resultData[i]["intensity"].append(shakeArea[j])
            resultData[i]["intensity"] = sorted(resultData[i]["intensity"], key=lambda x: int(x['AreaIntensity'][0]))
    
    return resultData

def haversine(lat1, lon1, lat2, lon2):
    # 將經緯度轉換為弧度
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    # 計算經緯度差
    delta_lat = lat2_rad - lat1_rad
    delta_lon = lon2_rad - lon1_rad

    # 哈弗辛公式
    a = math.sin(delta_lat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # 地球半徑（公里）
    R = 6371.0
    distance = R * c

    return f"{distance:.2f}"