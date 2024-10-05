from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_cors import CORS
from userControl.userControl import userControl_blueprint
from WeatherDataControl.WeatherControl import weatherControl_blueprint

DATABASE = 'data.sqlite'

app = Flask(__name__)
api = Api(app)
CORS(app)

    

@app.route('/')
def index():
    return 'hello there'
@app.route('/getAllWeatherData')
def getAllWeatherData():
    return None

app.register_blueprint(userControl_blueprint, url_prefix='/Users')
app.register_blueprint(weatherControl_blueprint, url_prefix='/Weather')

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8000, debug=True)