from flask import Flask,jsonify
from flask_restful import Api
from flask.views import MethodView
from datetime import datetime
import os
import sqlite3
import requests,urllib.parse,pytz,json
from userControl.userControl import userControl_blueprint
from userControl.Models import userDataResult
import requests,urllib.parse,pytz
from dataHandler.weatherData import resultElement

DATABASE = 'Backend/data.sqlite'

app = Flask(__name__)
api = Api(app)

#main
def getOpenData(): #中央氣象局
    return resultElement

def getMoenvData(): #環境部
    return None


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
app.register_blueprint(userControl_blueprint, url_prefix='/users')

if __name__ == '__main__':
    app.debug = True
    app.run(port=8000)