from datetime import datetime
from geopy.geocoders import Nominatim
import geopy.geocoders
import requests,pytz,json,certifi,ssl

#經度、緯度、時間 lat,lon,time

# 設定憑證
ctx = ssl.create_default_context(cafile=certifi.where())
geopy.geocoders.options.default_ssl_context = ctx

# 實例化
geolocator = Nominatim(scheme='http',user_agent='test')


# 設定經緯度
latitude = 25.06715187342581 
longitude = 121.66248756678424

# 進行反向地理編碼
location = geolocator.reverse((latitude, longitude))
nowCity = location.raw['address']['city']
nowsuburb = location.raw['address']['suburb']


#匯入城市及精確度代號
with open('./cityCode.json') as f:
    city = json.load(f)# 更改編碼

#天氣因子


sort = "time" #以時間升冪排序
time = datetime.now(pytz.timezone('Asia/Taipei')).strftime("%Y-%m-%dT%H:%M:%S")#取得符合取得資料格式的時間
api_key = "CWA-3D385D45-EFD5-4BD3-9677-9100AD39A4A2"

url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-0{city[nowCity+'3h']}?Authorization={api_key}&locationName={nowsuburb}&elementName=T,Wx,RH,WS,AT,PoP6h,WeatherDescription&sort={sort}&timeFrom={time}"

weatherData = requests.get(url).json()["records"]["locations"][0]["location"][0]["weatherElement"]

resultElement = {
    "weather":weatherData[0]["time"][0]["elementValue"][1]["value"],
    "bodyTemp":weatherData[1]["time"][0]["elementValue"][0]["value"],
    "temp":weatherData[2]["time"][0]["elementValue"][0]["value"],
    "wet":weatherData[3]["time"][0]["elementValue"][0]["value"],
    "weatherDes":weatherData[4]["time"][0]["elementValue"][0]["value"],
    "rainRate":weatherData[5]["time"][0]["elementValue"][0]["value"],
    "wind":weatherData[6]["time"][0]["elementValue"][0]["value"]
} 






