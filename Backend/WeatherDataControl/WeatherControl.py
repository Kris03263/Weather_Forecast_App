from flask import Blueprint,request,jsonify,make_response
import dataHandler.weatherData
import json
import sqlite3
from flask_cors import CORS
weatherControl_blueprint = Blueprint('weatherControl_blueprint', __name__)
CORS(weatherControl_blueprint)
DATABASE = 'data.sqlite'
conn = sqlite3.connect(DATABASE,check_same_thread=False)
cursor = conn.cursor()
@weatherControl_blueprint.route('/Get12hData',methods=['POST'])
def Get12hData():
    data = request.get_json()
    userID = data.get('userID')
    pre_longtitud = data.get('longitude')
    pre_latitude = data.get('latitude')
    pre_cusloc = data.get('cusloc') if data.get('cusloc') != None else ""
    if pre_longtitud == None or pre_latitude == None or userID == None:
        result = {
            "Stats" : "Index Error. Please Follow Documentaion Instructions"
            }
        response = make_response(jsonify(result),404)
        return response
    longtitude = float(pre_longtitud)
    latitude = float(pre_latitude)
    a = dataHandler.weatherData.get12hData(longtitude,latitude,pre_cusloc)
    if pre_cusloc == "":
        cursor.execute("UPDATE users set city =? where id =?",(a[0]["city"],userID))
    conn.commit()
    return jsonify(a)
@weatherControl_blueprint.route('/Get3hData',methods=['POST'])
def Get3hData():
    data = request.get_json()
    userID = data.get('userID')
    pre_longtitud = data.get('longitude')
    pre_latitude = data.get('latitude')
    pre_cusloc = data.get('cusloc') if data.get('cusloc') != None else ""
    if pre_longtitud == None or pre_latitude == None:
        result = {
            "Stats" : "Index Error. Please Follow Documentaion Instructions"
            }
        response = make_response(jsonify(result),404)
        return response
    longtitude = float(data.get('longitude'))
    latitude = float(data.get('latitude'))
    a = dataHandler.weatherData.get3hData(longtitude,latitude,pre_cusloc)
    if pre_cusloc == "":
        cursor.execute("UPDATE users set city =? where id =?",(a[0]["city"],userID))
    return jsonify(a)
