from flask import Flask,jsonify
from flask_restful import Api
from flask.views import MethodView
from datetime import datetime
from userControl.userControl import userControl_blueprint
from WeatherDataControl.WeatherControl import weatherControl_blueprint
from userControl.Models import userDataResult

DATABASE = 'Backend/data.sqlite'

app = Flask(__name__)
api = Api(app)

    

@app.route('/')
def index():
    return 'hello there'
@app.route('/getAllWeatherData')
def getAllWeatherData():
    return None

app.register_blueprint(userControl_blueprint, url_prefix='/users')
app.register_blueprint(weatherControl_blueprint, url_prefix='/weather')

if __name__ == '__main__':
    app.debug = True
    app.run(port=8000)