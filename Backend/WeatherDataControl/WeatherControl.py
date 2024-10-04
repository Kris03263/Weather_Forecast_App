from flask import Blueprint,request,jsonify
import dataHandler.weatherData
from datetime import datetime
weatherControl_blueprint = Blueprint('weatherControl_blueprint', __name__)

@weatherControl_blueprint.route('/Get12hData',methods=['POST'])
def Get12hData():
    '''
    {
    "longitude" : "xxxx",
    "latitude" : "xxxx",
    }
    '''
    data = request.get_json()
    longtitude = data.get('longitude')
    latitude = data.get('latitude')
    nowTime = datetime.now()
    a = dataHandler.weatherData.get12hData(latitude,longtitude)
    return jsonify(a)
@weatherControl_blueprint.route('/Get3hData',methods=['POST'])
def Get3hData():
    '''
    {
    "longitude" : "xxxx",
    "latitude" : "xxxx",
    }
    '''
    data = request.get_json()
    longtitude = data.get('longitude')
    latitude = data.get('latitude')
    nowTime = datetime.now()
    a = dataHandler.weatherData.get3hData(latitude,longtitude)
    return jsonify(a)
