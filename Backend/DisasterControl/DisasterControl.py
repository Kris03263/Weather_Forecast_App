from flask import Blueprint,request,jsonify
from dataHandler.earthQuakeData import getEarthData2,getEarthData
import dataHandler.weatherData
from flask_socketio import emit
from dataHandler.methodPack import getStorageCity
import threading
from flask_cors import CORS
disasterControl_blueprint = Blueprint('disasterControl_blueprint', __name__)
CORS(disasterControl_blueprint)
background_tasks = {}
@disasterControl_blueprint.route('/TestEarthQuakeSimulation',methods=['GET','POST'])
def testEarthQuakeSimulation():
    if request.method == 'GET':
        return getEarthData2('1','1','test')
    if request.method == 'POST':
        data = request.get_json()
        dataHandler.earthQuakeData.testData.append(data)
        return "update successful"
@disasterControl_blueprint.route('/GetEarthQuakeData',methods=['POST'])
def getEarthQuackData():
    data = request.get_json();
    userID = data.get('userID')
    pre_longtitude = data.get('longitude')
    longtitude = float(pre_longtitude)
    pre_latitude = data.get('latitude')
    latitude = float(pre_latitude)
    return jsonify(getEarthData(longtitude,latitude,getStorageCity(userID)))
# 定義地震polling專用事件
def check_and_broadcast_updates(socketio,sid, latitude, longitude,userID,stop_event):
    """
    每秒檢查 API 是否有新的地震資訊，並根據經緯度推送給相關客戶端。
    """
    try:
        socketio.sleep(0.5)
        last_earthquake_data = None
        print('I get into background')
        while not stop_event.is_set():
            socketio.sleep(1)  # 每秒輪詢一次
            # 獲取每個客戶端對應經緯度的最新地震資料
            earthquake_data = getEarthData2(float(longitude),float(latitude),getStorageCity(userID))
            if last_earthquake_data is None and len(earthquake_data) > 0:
                last_earthquake_data = earthquake_data[len(earthquake_data)-1]
                continue
            # 如果地震資料有變化，推送給該用戶
            if len(earthquake_data) > 0 and earthquake_data[len(earthquake_data)-1] != last_earthquake_data:
                print("change data")
                last_earthquake_data = earthquake_data[len(earthquake_data)-1]
                result = {
                    "地震資訊" : last_earthquake_data["content"],
                    "深度" : last_earthquake_data["depth"],
                    "距離" : last_earthquake_data["distance"],
                    "時間" : last_earthquake_data["time"],
                    "規模" : last_earthquake_data["magnitude"],
                    "所在地區震度" : last_earthquake_data["nowLocationIntensity"],
                }
                if not stop_event.is_set():
                    socketio.emit('earthquake_update', result,to=sid)
    except Exception as e:
        print(f"Error during message handling: {e}")
    
def register_socketio_events(socketio):
    @socketio.on('connect')
    def handle_connect():
        print(f'Client {request.sid} connected')
        

    @socketio.on('set_location')
    def handle_set_location(data):
        """
        客戶端在連接後發送經緯度，綁定到 socket id。
        """
        try:
            userID = data.get('userID')
            latitude = data.get('latitude')
            longitude = data.get('longitude')
            sid = request.sid
            stop_event = threading.Event()
            if sid in background_tasks:
                emit('error', {'message': 'You have connected it'},to=sid)
                return
            if sid not in background_tasks and latitude is not None and longitude is not None:
                # 綁定經緯度到客戶端的 socket id 
                print(f'Location set for {sid}: ({latitude}, {longitude})')
                background_task = socketio.start_background_task(check_and_broadcast_updates,socketio,sid,latitude,longitude,userID,stop_event)
                background_tasks[sid] = stop_event
                emit('registration_success', {'message': 'Location registered successfully'},to=sid)
            else:
                emit('error', {'message': 'Invalid location data'},to=sid)
        except Exception as e:
            print(f"Error during message handling: {e}")
    @socketio.on('disconnect')
    def handle_disconnect():
        """
        當客戶端斷開連接時，移除它的 socket id 和位置資料。
        """
        try:
            sid = request.sid
            stop_event = background_tasks.get(sid)
            if stop_event:
                stop_event.set()
                print(f'Client {request.sid} disconnected')
        except Exception as e:
            print(f"Error during message handling: {e}")
