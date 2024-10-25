from datetime import datetime,timedelta
from .airData import getAirData
from datetime import datetime
from .methodPack import setLocate
import requests,json,math,pytz
import redis

# 經度、緯度、時間 lat,lon,time
r = redis.Redis(host='redis', port=6379, db=0)
def getTime(t): return (t - timedelta(minutes=90)).strftime("%Y-%m-%dT%H:%M:%S")# 取得符合取得資料格式的時間

# 匯入城市及精確度代號
def city():
    citycode = None
    with open('cityCode.json') as f:
        citycode = json.load(f)
    return citycode

def url(ft,nowCity,nowdistrict,nowTime): 
    return f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-0{city()[nowCity+ft]}?Authorization=CWA-3D385D45-EFD5-4BD3-9677-9100AD39A4A2&locationName={nowdistrict}&elementName=T,Wx,RH,WS,WD,AT,MaxAT,MinAT,{'PoP6h'if ft=='3h'else'PoP12h'},WeatherDescription&sort=time&timeFrom={nowTime}"

def get3hData(lon,lat,cusloc):
    loc = cusloc if cusloc else setLocate(lat,lon)# 引入地理編碼
    offsetTime = getTime(datetime.now(pytz.timezone('Asia/Taipei')))# 修正時間
    cache_key = f"Weather_Data{lon}_{lat}_{offsetTime[:10]}_3"  # Create a unique key based on coordinates and date
    cached_data = r.get(cache_key)
    if cached_data:
        print("cached")
        return json.loads(cached_data)
    weatherData = requests.get(url('3h',loc["city"],loc["district"],offsetTime)).json()["records"]["locations"][0]["location"][0]["weatherElement"]
    resultElement = [] # 初始化陣列
    noData = 1 if datetime.strptime(weatherData[0]["time"][0]["startTime"],"%Y-%m-%d %H:%M:%S").hour%6!=0 else 0# 判斷是否處於降雨率無資料的情況
    airData = getAirData(lon,lat)

    for time in range(len(weatherData[0]["time"])):
        resultElement.append({**{
            "weatherText":   weatherData[0]["time"][time]["elementValue"][0]["value"],
            "weatherCode":   weatherData[0]["time"][time]["elementValue"][1]["value"],
            "bodyTemp":      weatherData[1]["time"][time]["elementValue"][0]["value"],
            "temp":          weatherData[2]["time"][time]["elementValue"][0]["value"],
            "wet":           weatherData[3]["time"][time]["elementValue"][0]["value"],
            "weatherDes":    weatherData[4]["time"][time]["elementValue"][0]["value"],
            "rainRate":      weatherData[5]["time"][int((time-noData)/2)]["elementValue"][0]["value"],
            "windSpeed":     weatherData[6]["time"][time]["elementValue"][0]["value"],
            "windDirection": weatherData[7]["time"][time]["elementValue"][0]["value"],
            "time":          weatherData[0]["time"][time]["startTime"],
            "city":          loc["city"],
            "district":      loc["district"]
        },**(airData if time==0 else {
            "sitename": None,
            "aqi":      None,
            "pm2.5":    None
        })})
    r.setex(cache_key, 3600, json.dumps(resultElement))
    print(r.get('test_key'))
    return resultElement

def get12hData(lon,lat,cusloc):
    loc = cusloc if cusloc else setLocate(lat,lon)# 引入地理編碼
    offsetTime = getTime(datetime.now(pytz.timezone('Asia/Taipei')))# 修正時間
    cache_key = f"Weather_Data{lon}_{lat}_{offsetTime[:10]}_12"  # Create a unique key based on coordinates and date
    cached_data = r.get(cache_key)
    if cached_data:
        print("cached")
        return json.loads(cached_data)
    weatherData = requests.get(url('12h',loc["city"],loc["district"],offsetTime)).json()["records"]["locations"][0]["location"][0]["weatherElement"]
    resultElement = []# 初始化陣列
    dayOffset = 0 if datetime.strptime(weatherData[0]["time"][0]["startTime"],"%Y-%m-%d %H:%M:%S").hour < 18 else 1#調整數據為白天
    if dayOffset : resultElement.append(get3hData(lon,lat,cusloc)[0])
    
    for time in range(0,len(weatherData[0]["time"])-dayOffset,2):
        rainRateDataNow = weatherData[0]["time"][time+dayOffset]["elementValue"][0]["value"]
        resultElement.append({
                "weatherText":   weatherData[5]["time"][time+dayOffset]["elementValue"][0]["value"],
                "weatherCode":   weatherData[5]["time"][time+dayOffset]["elementValue"][1]["value"],
                "bodyTemp":      str(math.ceil((int(weatherData[4]["time"][time+dayOffset]["elementValue"][0]["value"]) + int(weatherData[7]["time"][time+dayOffset]["elementValue"][0]["value"]))/2)),
                "temp":          weatherData[1]["time"][time+dayOffset]["elementValue"][0]["value"],
                "wet":           weatherData[2]["time"][time+dayOffset]["elementValue"][0]["value"],
                "weatherDes":    weatherData[6]["time"][time+dayOffset]["elementValue"][0]["value"],
                "rainRate":      rainRateDataNow if rainRateDataNow!=" " else "尚無資料",
                "windSpeed":     weatherData[4]["time"][time+dayOffset]["elementValue"][0]["value"],
                "windDirection": weatherData[8]["time"][time+dayOffset]["elementValue"][0]["value"],
                "time":          weatherData[0]["time"][time+dayOffset]["startTime"],
                "city":          loc["city"],
                "district":      loc["district"],
                "sitename": None,
                "aqi":      None,
                "pm2.5":    None
        })# 體感溫度以最大與最小取平均值,降雨量無較遠資料
    r.setex(cache_key, 3600, json.dumps(resultElement))
    print(r.get('test_key'))
    return resultElement

# 121.66248756678424121,25.06715187342581
# 已知問題 
# 1.一週天氣若於白天請求，無法求取當天白天資料 解決辦法：以現時之天氣取代
# 2.空氣監測值只允許取得現時資料，故只在現時資料中添加




