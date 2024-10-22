from datetime import datetime
import requests
import pytz
import redis
import json

# Connect to Redis server
r = redis.Redis(host='redis', port=6379, db=0)
print("the cache",r.get('test_key'))

def getAirData(lon, lat):
    nowTime = datetime.now(pytz.timezone('Asia/Taipei')).strftime("%Y-%m-%d %H:%M:%S")
    cache_key = f"air_data_{lon}_{lat}_{nowTime[:10]}"  # Create a unique key based on coordinates and date
    
    # Check if the data is already cached in Redis
    cached_data = r.get(cache_key)
    if cached_data:
        return json.loads(cached_data)
        printf("cached")
    
    # If not cached, proceed to fetch data from the external API
    url = f"https://data.moenv.gov.tw/api/v2/aqx_p_432?&api_key=7fcc7250-55c6-497a-aa44-cfba6d8f2c83&filters=publishtime,LE,{nowTime}&fields=sitename,aqi,pm2.5,longitude,latitude"
    try:
        AQIData = requests.get(url).json()["records"]
        
        distant = float(100)
        siteName = None
        for site in AQIData:
            distant_temp = (((float(site["longitude"]) - lon)**2) + ((float(site["latitude"]) - lat)**2))**0.5
            if distant_temp < distant:
                distant = distant_temp
                siteName = site
        
        result = {
            "sitename": siteName["sitename"] if siteName["sitename"] else "noData",
            "aqi": siteName["aqi"] if siteName["aqi"] else "noData",
            "pm2.5": siteName["pm2.5"] if siteName["pm2.5"] else "noData"
        }
        
        # Store the result in Redis with an expiration time (e.g., 1 hour = 3600 seconds)
        r.setex(cache_key, 3600, json.dumps(result))
        print(r.get('test_key'))
        
        return result
    except Exception as e:
        print(e)
        return {
            "sitename": "fetch data error",
            "aqi": "fetch data error",
            "pm2.5": "fetch data error"
        }
