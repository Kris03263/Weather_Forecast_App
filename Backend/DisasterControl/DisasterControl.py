from flask import Blueprint,request,jsonify
from dataHandler.earthQuakeData import getEarthData2
import dataHandler.weatherData
from flask_socketio import emit
import time
import json
from flask_cors import CORS
disasterControl_blueprint = Blueprint('disasterControl_blueprint', __name__)
CORS(disasterControl_blueprint)
connectClient = {}
# 定義地震polling專用事件
def check_and_broadcast_updates(socketio):
    """
    每秒檢查 API 是否有新的地震資訊，並根據經緯度推送給相關客戶端。
    """
    last_earthquake_data = None
    while True:
        socketio.sleep(3)  # 每秒輪詢一次
        for sid, location in connectClient.items():
            latitude, longitude = location
            # 獲取每個客戶端對應經緯度的最新地震資料
            earthquake_data = getEarthData2(longitude,latitude)
            # 如果地震資料有變化，推送給該用戶
            if earthquake_data and earthquake_data != last_earthquake_data:
                last_earthquake_data = earthquake_data
                socketio.emit('earthquake_update', earthquake_data, room=sid)
    
def register_socketio_events(socketio):
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
        if latitude is not None and longitude is not None:
            # 綁定經緯度到客戶端的 socket id
            connectClient[request.sid] = (latitude, longitude)
            print(f'Location set for {request.sid}: ({latitude}, {longitude})')
            emit('registration_success', {'message': 'Location registered successfully'},room=request.sid)
            socketio.start_background_task(check_and_broadcast_updates,socketio)
        else:
            emit('error', {'message': 'Invalid location data'})
    @socketio.on('disconnect')
    def handle_disconnect():
        """
        當客戶端斷開連接時，移除它的 socket id 和位置資料。
        """
        if request.sid in connectClient:
            del connectClient[request.sid]
            print(f'Client {request.sid} disconnected')
