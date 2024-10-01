from flask import Blueprint,request,jsonify
import dataHandler.weatherData
weatherControl_blueprint = Blueprint('weatherControl_blueprint', __name__)

@weatherControl_blueprint.route('/Get1DayData',methods=['GET'])
def Get1DayData():
    a = dataHandler.weatherData.getData()
    return a