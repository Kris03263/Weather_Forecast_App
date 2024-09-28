from datetime import datetime
import requests,pytz

dataset = "/aqx_p_432" 
offset = 0
limit = 10
api_key = "7fcc7250-55c6-497a-aa44-cfba6d8f2c83"
nowTime = datetime.now(pytz.timezone('Asia/Taipei')).strftime("%Y-%m-%d %H:%M:%S")#取得符合取得資料格式的時間

url = f"https://data.moenv.gov.tw/api/v2{dataset}?format=json&offset={offset}&limit={limit}&api_key={api_key}&filters=publishtime,LE,{nowTime}"
AQIData = requests.get(url).json()

print(AQIData["records"][0]["sitename"])