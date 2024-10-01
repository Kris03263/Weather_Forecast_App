from datetime import datetime,timedelta
from geopy.geocoders import Nominatim
import geopy.geocoders
import requests,pytz,json,certifi,ssl,math

#經度、緯度、時間 lat,lon,time

# 設定憑證
ctx = ssl.create_default_context(cafile=certifi.where())
geopy.geocoders.options.default_ssl_context = ctx

# 實例化
geolocator = Nominatim(scheme='http',user_agent='test')

def setLocate(latitude,longitude):
    # 設定經緯度
    latitude = 25.06715187342581 
    longitude = 121.66248756678424

    # 進行反向地理編碼
    location = geolocator.reverse((latitude, longitude))
    nowCity = location.raw['address']['city']
    nowSuburb = location.raw['address']['suburb']
    return {
         "city":nowCity,
         "suburb":nowSuburb
    }

def getTime(t): return (t - timedelta(minutes=90)).strftime("%Y-%m-%dT%H:%M:%S")#取得符合取得資料格式的時間

#匯入城市及精確度代號
with open('/Users/weiyouen/Documents/GitHub/WFA/Backend/cityCode.json') as f:
    city = json.load(f)# 更改編碼

sort = "time" #以時間升冪排序
api_key = "CWA-3D385D45-EFD5-4BD3-9677-9100AD39A4A2"

def url(ft,nowCity,nowSuburb,nowTime): return f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-0{city[nowCity+ft]}?Authorization={api_key}&locationName={nowSuburb}&elementName=T,Wx,RH,WS,WD,AT,MaxAT,MinAT,{"PoP6h"if ft=='3h'else"PoP12h"},WeatherDescription&sort={sort}&timeFrom={nowTime}"

def get3hData(lat,lon,nowTime):
    loc = setLocate(lat,lon)
    offsetTime = getTime(nowTime)
    weatherData = requests.get(url('3h',loc["city"],loc["suburb"],offsetTime)).json()["records"]["locations"][0]["location"][0]["weatherElement"]
    resultElement = []
    if datetime.strptime(weatherData[0]["time"][0]["startTime"],"%Y-%m-%d %H:%M:%S").hour%6!=0:
        weatherData[5]["time"].insert(0,weatherData[5]["time"][0])
    for time in range(len(weatherData[0]["time"])):
        resultElement.append({
            "weatherText":   weatherData[0]["time"][time]["elementValue"][0]["value"],
            "weatherCode":   weatherData[0]["time"][time]["elementValue"][1]["value"],
            "bodyTemp":      weatherData[1]["time"][time]["elementValue"][0]["value"],
            "temp":          weatherData[2]["time"][time]["elementValue"][0]["value"],
            "wet":           weatherData[3]["time"][time]["elementValue"][0]["value"],
            "weatherDes":    weatherData[4]["time"][time]["elementValue"][0]["value"],
            "rainRate":      weatherData[5]["time"][math.floor(time/2)]["elementValue"][0]["value"],
            "windSpeed":     weatherData[6]["time"][time]["elementValue"][0]["value"],
            "windDirection": weatherData[7]["time"][time]["elementValue"][0]["value"]
        })
    return weatherData

def get12hData(lat,lon,nowTime):
    loc = setLocate(lat,lon)
    offsetTime = getTime(nowTime)
    weatherData = requests.get(url('12h',loc["city"],loc["suburb"],offsetTime)).json()["records"]["locations"][0]["location"][0]["weatherElement"]
    resultElement = []
    hour = datetime.strptime(weatherData[0]["time"][0]["startTime"],"%Y-%m-%d %H:%M:%S").hour
    day = 1 if hour<18 else 0
    lastRainRate = ""
    for time in range(0,len(weatherData[0]["time"]),2):
        if(weatherData[0]["time"][time+day]["elementValue"][0]["value"] != " "):lastRainRate = weatherData[0]["time"][time+day]["elementValue"][0]["value"]
        resultElement.append({
                "weatherText":   weatherData[5]["time"][time+day]["elementValue"][0]["value"],
                "weatherCode":   weatherData[5]["time"][time+day]["elementValue"][1]["value"],
                "bodyTemp":      (int(weatherData[4]["time"][time+day]["elementValue"][0]["value"]) + int(weatherData[7]["time"][time+day]["elementValue"][0]["value"]))/2,
                "temp":          weatherData[1]["time"][time+day]["elementValue"][0]["value"],
                "wet":           weatherData[2]["time"][time+day]["elementValue"][0]["value"],
                "weatherDes":    weatherData[6]["time"][time+day]["elementValue"][0]["value"],
                "rainRate":      weatherData[0]["time"][time+day]["elementValue"][0]["value"] if weatherData[0]["time"][time+day]["elementValue"][0]["value"]!= " " else lastRainRate,
                "windSpeed":     weatherData[4]["time"][time+day]["elementValue"][0]["value"],
                "windDirection": weatherData[8]["time"][time+day]["elementValue"][0]["value"]
        })
    return resultElement

current_time = datetime.now()
print(get3hData(25.06715187342581,121.66248756678424,current_time))







