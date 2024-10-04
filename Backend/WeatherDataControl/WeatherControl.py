from flask import Blueprint,request,jsonify
import dataHandler.weatherData
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
    longtitude = float(data.get('longitude'))
    latitude = float(data.get('latitude'))
    a = dataHandler.weatherData.get12hData(longtitude,latitude)
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
    longtitude = float(data.get('longitude'))
    latitude = float(data.get('latitude'))
    a = dataHandler.weatherData.get3hData(longtitude,latitude)
    return jsonify(a)
