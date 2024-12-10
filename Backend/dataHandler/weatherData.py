from datetime import datetime, timedelta
from .airData import getAirData
from .locationToAxis import transToAxis
from datetime import datetime
import requests
import json
import math
import pytz
import redis
from redis.exceptions import ConnectionError
import os

# 經度、緯度、時間 lat,lon,time
redis_read_host = os.getenv('REDIS_READ_HOST', 'localhost')  # 默認為 localhost
redis_write_host = '35.221.142.225'  # 設定寫入的 Redis 主機 IP
redis_port = 80  # 設定 Redis 寫入端口

# 建立 Redis 讀取連線
try:
    r_read = redis.Redis(host=redis_read_host, port=6379, db=0)
except ConnectionError as e:
    print("Connect to Redis (read) failed:", e)

# 建立 Redis 寫入連線
try:
    r_write = redis.Redis(host=redis_write_host, port=redis_port, db=0)
except ConnectionError as e:
    print("Connect to Redis (write) failed:", e)


def getTime(t): return (t - timedelta(minutes=90)
                        ).strftime("%Y-%m-%dT%H:%M:%S")  # 取得符合取得資料格式的時間

# 匯入城市及精確度代號


def city():
    citycode = None
    with open('cityCode.json') as f:
        citycode = json.load(f)
    return citycode


def url(ft, nowCity, nowdistrict, nowTime):
    return f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-0{city()[nowCity+ft]}?Authorization=CWA-3D385D45-EFD5-4BD3-9677-9100AD39A4A2&locationName={nowdistrict}&sort=time&timeFrom={nowTime}"


def get3hData(cusloc):
    loc = cusloc # 引入地理編碼
    offsetTime = getTime(datetime.now(pytz.timezone('Asia/Taipei')))  # 修正時間
    # Create a unique key based on coordinates and date
    axis = transToAxis(cusloc)
    cache_key = f"Weather_Data{axis['lon']}_{axis['lat']}_{offsetTime[:10]}_3"

    try:
        cached_data = r_read.get(cache_key)
        if cached_data:
            print("cached")
            return json.loads(cached_data)
    except ConnectionError:
        print("Redis connection failed, retrieving fresh data.")

    weatherData = requests.get(url('3h', loc["city"], loc["district"], offsetTime)).json()[
        "records"]["Locations"][0]["Location"][0]["WeatherElement"]
    resultElement = []  # 初始化陣列
    timeOffset = 3-datetime.strptime(weatherData[0]["Time"][0]["DataTime"],"%Y-%m-%d %H:%M:%S").hour % 3
    airData = getAirData(axis["lon"], axis["lat"])

    for time in range(len(weatherData[8]["Time"])):
        resultElement.append({**{
            "weatherText": weatherData[8]["Time"][time]["ElementValue"][0]["Weather"],
            "weatherCode": weatherData[8]["Time"][time]["ElementValue"][0]["WeatherCode"],
            "bodyTemp": weatherData[3]["Time"][time+timeOffset]["ElementValue"][0]["ApparentTemperature"],
            "temp": weatherData[0]["Time"][time+timeOffset]["ElementValue"][0]["Temperature"],
            "wet": weatherData[2]["Time"][time+timeOffset]["ElementValue"][0]["RelativeHumidity"],
            "weatherDes": weatherData[9]["Time"][time]["ElementValue"][0]["WeatherDescription"],
            "rainRate": weatherData[7]["Time"][time]["ElementValue"][0]["ProbabilityOfPrecipitation"],
            "windSpeed": weatherData[5]["Time"][time]["ElementValue"][0]["WindSpeed"],
            "windDirection": weatherData[6]["Time"][time]["ElementValue"][0]["WindDirection"],
            "time": weatherData[8]["Time"][time]["StartTime"],
            "city": loc["city"],
            "district": loc["district"]
        }, **(airData if time == 0 else {
            "sitename": None,
            "aqi": None,
            "pm2.5": None
        })})

    # Try to cache fresh data in Redis (write to different instance)
    try:
        r_write.setex(cache_key, 3600, json.dumps(resultElement))
    except ConnectionError:
        print("Redis unavailable for write, skip caching.")
    return resultElement

def get12hData(cusloc):
    loc = cusloc  # 引入地理編碼
    offsetTime = getTime(datetime.now(pytz.timezone('Asia/Taipei')))  # 修正時間
    # Create a unique key based on coordinates and date
    axis = transToAxis(cusloc)
    cache_key = f"Weather_Data{axis['lon']}_{axis['lat']}_{offsetTime[:10]}_12"
    try:
        cached_data = r_read.get(cache_key)
        if cached_data:
            print("cached")
            return json.loads(cached_data)
    except Exception as e:
        print("Issue with Redis (read), skip caching.:", e)
    weatherData = requests.get(url('12h', loc["city"], loc["district"], offsetTime)).json()[
        "records"]["Locations"][0]["Location"][0]["WeatherElement"]
    resultElement = []  # 初始化陣列
    dayOffset = 0 if datetime.strptime(
        weatherData[0]["Time"][0]["StartTime"], "%Y-%m-%d %H:%M:%S").hour < 18 else 1  # 調整數據為白天
    if dayOffset:
        resultElement.append(get3hData(cusloc)[0])

    for time in range(0, len(weatherData[0]["Time"])-dayOffset, 2):
        rainRateDataNow = weatherData[11]["Time"][time +
                                                 dayOffset]["ElementValue"][0]["ProbabilityOfPrecipitation"]
        resultElement.append({
            "weatherText":   weatherData[12]["Time"][time+dayOffset]["ElementValue"][0]["Weather"],
            "weatherCode":   weatherData[12]["Time"][time+dayOffset]["ElementValue"][0]["WeatherCode"],
            "bodyTemp":      str(math.ceil((int(weatherData[5]["Time"][time+dayOffset]["ElementValue"][0]["MaxApparentTemperature"]) + int(weatherData[6]["Time"][time+dayOffset]["ElementValue"][0]["MinApparentTemperature"]))/2)),
            "temp":          weatherData[0]["Time"][time+dayOffset]["ElementValue"][0]["Temperature"],
            "wet":           weatherData[4]["Time"][time+dayOffset]["ElementValue"][0]["RelativeHumidity"],
            "weatherDes":    weatherData[14]["Time"][time+dayOffset]["ElementValue"][0]["WeatherDescription"],
            "rainRate":      rainRateDataNow if rainRateDataNow != "-" else "尚無資料",
            "windSpeed":     weatherData[9]["Time"][time+dayOffset]["ElementValue"][0]["WindSpeed"],
            "windDirection": weatherData[10]["Time"][time+dayOffset]["ElementValue"][0]["WindDirection"],
            "time":          weatherData[0]["Time"][time+dayOffset]["StartTime"],
            "city":          loc["city"],
            "district":      loc["district"],
            "sitename": None,
            "aqi":      None,
            "pm2.5":    None
        })  # 體感溫度以最大與最小取平均值,降雨量無較遠資料
    try:
        r_write.setex(cache_key, 3600, json.dumps(resultElement))
        print(r_write.get('test_key'))
    except Exception as e:
        print("Issue with Redis (write), skip caching.:", e)
    return resultElement

# 121.66248756678424121,25.06715187342581
# 已知問題
# 1.一週天氣若於白天請求，無法求取當天白天資料 解決辦法：以現時之天氣取代
# 2.空氣監測值只允許取得現時資料，故只在現時資料中添加
