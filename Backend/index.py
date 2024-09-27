<<<<<<< Updated upstream
from flask import Flask,jsonify
from flask_restful import Resource, Api
from flask import g
import os
import sqlite3
DATABASE = 'Backend/data.sqlite'
=======
import requests,urllib.parse,pytz
from flask import Flask,jsonify
from flask.views import MethodView
from datetime import datetime

>>>>>>> Stashed changes
app = Flask(__name__)
api = Api(app)

#main
def getOpenData(): #中央氣象局
    city = "F-D0047-069" #新北市一週 編碼後以經緯度轉換
    limit = 10
    offset = 0
    district = urllib.parse.quote("汐止區")#以經緯度轉換
    elementName = {
        "temp":"T",
        "weather":"Wx",
        "wet":"RH",
        "wind":"Wind",
        "bodyTemp":"AT",
        "rainRate":"PoP6h"
    } #天氣因子
    sort = "time"
    nowTime = datetime.now(pytz.timezone('Asia/Taipei')).strftime("%Y-%m-%dT%H:%M:%S")#取得符合取得資料格式的時間
    api_key = "CWA-3D385D45-EFD5-4BD3-9677-9100AD39A4A2"

    url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/{city}?Authorization={api_key}&limit={limit}&offset={offset}&format=JSON&locationName={district}&elementName={elementName['bodyTemp']}&sort={sort}&timeFrom={nowTime}"
    wheatherData = requests.get(url).json()
    return wheatherData["records"]["locations"][0]["location"][0]["weatherElement"][0]["time"][0]["dataTime"]#很醜

def getMoenvData(): #環境部
    dataset = "/aqx_p_432" #這個才是現在資料
    offset = 0
    limit = 10
    api_key = "7fcc7250-55c6-497a-aa44-cfba6d8f2c83"

    url = f"https://data.moenv.gov.tw/api/v2{dataset}?format=json&offset={offset}&limit={limit}&api_key={api_key}"
    AQIData = requests.get(url).json()
    return AQIData["records"][0]["sitename"]


class API_Test(MethodView):
    def get(self):
        return jsonify(data=getOpenData())

    def post(self):
        return jsonify(data=getMoenvData())

@app.route('/')
def index():
    return 'hello there'
@app.route('/getAllWeatherData')
def getAllWeatherData():
    return None

app.add_url_rule('/test_api/', view_func=API_Test.as_view('test_api'))

if __name__ == '__main__':
    app.debug = True
    app.run()