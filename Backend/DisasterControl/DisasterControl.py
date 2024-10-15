from flask import Blueprint,request,jsonify
from dataHandler.earthQuakeData import getEarthData2
import dataHandler.weatherData
from flask_socketio import emit,join_room,leave_room
from threading import Event
import time
import json
from flask_cors import CORS
disasterControl_blueprint = Blueprint('disasterControl_blueprint', __name__)
CORS(disasterControl_blueprint)
connectClient = {}
background_tasks = {}
# 定義地震polling專用事件
def check_and_broadcast_updates(socketio,sid, latitude, longitude):
    """
    每秒檢查 API 是否有新的地震資訊，並根據經緯度推送給相關客戶端。
    """
    last_earthquake_data = None
    while True:
        socketio.sleep(3)  # 每秒輪詢一次
        # 獲取每個客戶端對應經緯度的最新地震資料
        earthquake_data = getEarthData2(longitude,latitude)
        # 如果地震資料有變化，推送給該用戶
        if earthquake_data and earthquake_data != last_earthquake_data:
            last_earthquake_data = earthquake_data
            socketio.emit('earthquake_update', str(earthquake_data) + sid,to=sid)
    
def register_socketio_events(socketio):
    global counter
    counter = 0
    @socketio.on('connect')
    def handle_connect():
        print(f'Client {request.sid} connected')
        

    @socketio.on('set_location')
    def handle_set_location(data):
        """
        客戶端在連接後發送經緯度，綁定到 socket id。
        """
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        sid = request.sid
        if sid in background_tasks:
            emit('error', {'message': 'You have connected it'})
            return
        if sid not in background_tasks and latitude is not None and longitude is not None:
            # 綁定經緯度到客戶端的 socket id
            connectClient[request.sid] = (latitude, longitude)
            join_room(sid)
            print(f'Location set for {sid}: ({latitude}, {longitude})')
            emit('registration_success', {'message': 'Location registered successfully'},to=sid)
            background_task = socketio.start_background_task(check_and_broadcast_updates,socketio,sid,latitude,longitude)
            background_tasks[sid] = background_task
        else:
            emit('error', {'message': 'Invalid location data'})
    @socketio.on('disconnect')
    def handle_disconnect():
        """
        當客戶端斷開連接時，移除它的 socket id 和位置資料。
        """
        if request.sid in background_tasks:
        # 清理背景任務（可以用其他方式來終止任務）
            del background_tasks[request.sid]
        if request.sid in connectClient:
            leave_room(request.sid)
            del connectClient[request.sid]
            print(f'Client {request.sid} disconnected')
