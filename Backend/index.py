from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_swagger_ui import get_swaggerui_blueprint
app = Flask(__name__)
socketio = SocketIO(app,async_mode='threading')
api = Api(app)
CORS(app)
@app.route('/doc')
def doc(): return open('swagger.json').read()
API_URL = '/doc'
SWAGGER_URL = '/Swagger'  # 将 Swagger UI 注册到根路径
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,  # Swagger UI 的 URL
    API_URL,  # Swagger 文档的 URL
    config={
        'app_name': "My API"  # 配置 Swagger UI 的应用名称
    }
)
@app.route('/')
def index():
    return 'hello there'
from userControl.userControl import userControl_blueprint
from WeatherDataControl.WeatherControl import weatherControl_blueprint
from DisasterControl.DisasterControl import disasterControl_blueprint,register_socketio_events
app.register_blueprint(userControl_blueprint, url_prefix='/Users')
app.register_blueprint(weatherControl_blueprint, url_prefix='/Weather')
app.register_blueprint(disasterControl_blueprint, url_prefix='/Disaster')
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
register_socketio_events(socketio)

if __name__ == '__main__':
    socketio.run(app, host= "0.0.0.0", port=8000, debug=True, allow_unsafe_werkzeug=True)
