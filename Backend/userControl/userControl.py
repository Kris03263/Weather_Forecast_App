from flask import Blueprint,request,jsonify,make_response
import sqlite3
from .Models import UserDataResult,Habit,Sport,SportsSuggestion,HabitsSuggestion
import dataHandler.weatherData
from flask_cors import CORS
import json

userControl_blueprint = Blueprint('userControl_blueprint', __name__)
DATABASE = 'data.sqlite'
conn = sqlite3.connect(DATABASE,check_same_thread=False)
CORS(userControl_blueprint)
cursor = conn.cursor()
def checkUserExits(id):
    cursor.execute("Select * from users where id =?",[id])
    user = cursor.fetchall()
    if len(user) < 1:
        return False
    return True
def getSportsSuggestion(nowWeatherData):
    nowRainRate = nowWeatherData["rainRate"]
    nowPM = nowWeatherData["pm2.5"]
    nowAirQuality = nowWeatherData["aqi"]
    nowTemp = nowWeatherData["temp"]
    basketballSuggetstion = ""
    badmintonSuggestion = ""
    volleyballSuggestion = ""
    tabletennisSuggestion = ""
    runSuggestion = ""
    swimSuggestion = ""
    bikeSuggestion = ""
    result = []
    if int(nowRainRate) > 50:
        basketballSuggetstion = "It might rain today, not suitable for playing basketball!"
        badmintonSuggestion = "It might rain today,do not play badminton outdoor!"
        volleyballSuggestion = "It might rain today,do not play volleyball outdoor!"
        tabletennisSuggestion = "Today is suitable for playing tabletennis!"
        
    else:
        basketballSuggetstion = "Today is suitable for playing  basketball!"
        badmintonSuggestion = "Today is suitable for playing badminton no matter outdoor or indoor!"
        volleyballSuggestion = "Today is suitable for playing volleyball no matter outdoor or indoor!"
        tabletennisSuggestion = "Today is suitable for playing tabletennis!"
    if nowAirQuality != None and int(nowAirQuality) > 100:
        runSuggestion = "Today is suitable for running or jogging due to the nice air quality!"
        bikeSuggestion = "Today is suitable for biking due to the nice air quality!"
    else:
        runSuggestion = "Running or Jogging might not be a good choice today due to the bad air quality!"
        bikeSuggestion = "Biking not be a good choich today due to the bad air quality!"
    if int(nowTemp) > 25:
        swimSuggestion = "If you planning to swimming today, don't forget drink more water!"
    else:
        swimSuggestion = "If you planning to swimming today, take care of your body!"
    result.append(basketballSuggetstion)
    result.append(badmintonSuggestion)
    result.append(volleyballSuggestion)
    result.append(swimSuggestion)
    result.append(bikeSuggestion)
    result.append(runSuggestion)
    result.append(tabletennisSuggestion)
    return result

def getHabitsSuggestion(nowWeatherData):
    nowRainRate = nowWeatherData["rainRate"]
    nowAirQuality = nowWeatherData["aqi"]
    nowTemp = nowWeatherData["temp"]
    dessertSuggestion = ""
    hikingSuggestion = ""
    mountainSuggestion = ""
    gameSuggestion = ""
    outdoorSuggestion = ""
    studySuggestion = "no matter what is the weather right now, you can still go study"
    result = []
    if int(nowRainRate) > 50 :
        dessertSuggestion = "Today might be rain, is a good choic for making dessert indoor! "
        gameSuggestion ="Today might be rain, is a good choic for making dessert indoor! "
        hikingSuggestion ="Today might be rain, hiking is not a good choice for today!"
        mountainSuggestion ="Today might be rain, mountain climbing is not a good choice for today!"
        outdoorSuggestion ="Today might be rain, don't forget bring your umbrella! "
    else:
        dessertSuggestion ="Today has a nice weather, but still a good choic for doing dessert!"
        gameSuggestion ="Today has a nice weather, but still a good choic for playing game!"
        hikingSuggestion ="Today has a nice weather to go hiking!"
        mountainSuggestion ="Today has a nice weather to go mountain climbing!"
        outdoorSuggestion ="Today has a nice weather for outdoor activity!"
    if int(nowTemp) > 30:
        hikingSuggestion = "Today is a hot day, if you wanna go hiking, don't forget drink water!"
        mountainSuggestion = "Today is a hot day, if you wanna go mountain climbing, don't forget drink water!"
        outdoorSuggestion = "Today is a hot day, if you have some outdoor activity, don't forget drink water!"
    if nowAirQuality != None and  int(nowAirQuality) >100:
        hikingSuggestion = "Today has a bad air quality, we suggest you do not go hiking"
        mountainSuggestion = "Today has a bad air quality, we suggest you do not go mountain climbing"
        outdoorSuggestion = "Today has a bad air quality, wearing mask if you have outdoor activity"
    result.append(dessertSuggestion)
    result.append(hikingSuggestion)
    result.append(mountainSuggestion)
    result.append(gameSuggestion)
    result.append(outdoorSuggestion)
    result.append(studySuggestion)
    return result

    

    
#登入
@userControl_blueprint.route('/Login',methods=['POST'])
def login():
    '''
    {
    "userAccount" : "test",
    "password" : "test"
    }
    '''
    data = request.get_json()
    userAccount = data.get('userAccount')
    password = data.get('password')
    if userAccount == None or password == None:
        dt = UserDataResult("-1","","","Index Error. Please Follow Documentaion Instructions")
        response = make_response(jsonify(dt.to_dict()),404)
        return response
    cursor.execute("SELECT * FROM users WHERE account =? and password =?",(userAccount,password))
    user = cursor.fetchall()
    if len(user) == 0:
        dt = UserDataResult("-1","","","no user")
        response = make_response(jsonify(dt.to_dict()),404)
        return response
    elif len(user) != 0 and user[0][3] == 1:
        dt = UserDataResult("-1","","","user was deleted")
        response = make_response(jsonify(dt.to_dict()),404)
        return response
    else:
        dt = UserDataResult(user[0][0],user[0][1],user[0][2],"successful")
        return jsonify(dt.to_dict()) 
#獲取使用者資料 / 註冊 /刪除
@userControl_blueprint.route('/',methods=['GET','POST','DELETE'])
def register():
    if request.method == 'GET':
        id = request.args.get('ID')
        if id == None:
            id = request.args.get('id')
        if id == None:
            dt = UserDataResult("-1","","","Index Error. Please Follow Documentaion Instructions")
            response = make_response(jsonify(dt.to_dict()),404)
            return response           
        if checkUserExits(id) == False:
            dt = UserDataResult("-1","","","no user")
            response = make_response(jsonify(dt.to_dict()),404)
            return response
        cursor.execute("Select * from users where id =?",[id])
        user = cursor.fetchall()
        dt = UserDataResult(user[0][0],user[0][1],user[0][2],"successful")
        return jsonify(dt.to_dict())
        
    if request.method == 'POST':
        '''
        {
        "userAccount" : "test",
        "password" : "test"
        }
        '''
        data = request.get_json()
        userAccount = data.get('userAccount')
        password = data.get('password')
        if userAccount == None or password == None:
            dt = UserDataResult("-1","","","Index Error. Please Follow Documentaion Instructions")
            response = make_response(jsonify(dt.to_dict()),404)
            return response
        cursor.execute("SELECT * FROM users WHERE account =?",[userAccount])
        user = cursor.fetchall()
        if len(user) > 0:
            dt = UserDataResult("-1","","","Account have been used")
            response = make_response(jsonify(dt.to_dict()),404)
            return response
        cursor.execute("INSERT INTO users(account,password,deleted) VALUES(?,?,?)",(userAccount,password,0))
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE account =? and password =?",(userAccount,password))
        user = cursor.fetchall()
        if(len(user) != 0):
            dt = UserDataResult(user[0][0],user[0][1],user[0][2],"Register Successful")
            response = make_response(jsonify(dt.to_dict()),201)
            return response
        else:
            dt = UserDataResult("-1","","","Register Error")
            return jsonify(dt.to_dict())
    if request.method == 'DELETE':
        '''
        {
        "userID" : "userid"
        }
        '''
        data = request.get_json()
        id = data.get('userID')
        if id == None:
            result = {
                "status" : "Index Error. Please Follow Documentaion Instructions"
            }
            response = make_response(jsonify(result),404)
            return response
        cursor.execute("UPDATE users SET deleted = 1 where id =?",[id])
        conn.commit()
        result ={
            "status" : "Successful"
        }
        response = make_response(jsonify(result),200)
        return response
#獲取對應使用者嗜好/上傳嗜好
@userControl_blueprint.route('/UserHabits',methods=['GET','POST'])
def habits():
    if request.method == "GET":
        id = request.args.get('ID')
        if id == None:
            id = request.args.get('id')
        if id == None:
            dt = Habit("-1","Index Error. Please Follow Documentaion Instructions")
            response = make_response(jsonify(dt.to_dict()),404)
            return response  
        habits = []
        if checkUserExits(id) == False:
            habit = Habit(-1,"Undefine User")
            habits.append(habit.to_dict())
            response = make_response(jsonify(habits),404)
            return response
        sql_query = """
        SELECT * FROM habits where habits.id in 
        (select habitID from usersAndHabits where userID=?)
        """ 
        cursor.execute(sql_query,id)
        data = cursor.fetchall()
        for i in data:
            habit = Habit(i[0],i[1])
            habits.append(habit.to_dict())
        response = make_response(jsonify(habits),200)
        return response
    if request.method == "POST":
        '''
        {
        "userID : "id"
        "habitIDs" : "habitsIDList"
        }
        '''
        data = request.get_json();
        userID = data.get('userID')
        habbitIdList = data.get('habitIDs')
        if userID == None:
            result = {
            "Stats" : "Index Error. Please Follow Documentaion Instructions"
            }
            response = make_response(jsonify(result),404)
            return response
        if checkUserExits(userID) == False:
            result = {
                "Stats" : "No user"
            }
            response = make_response(jsonify(result),404)
            return response
        cursor.execute("DELETE From usersAndHabits where userID = ?",[userID])
        conn.commit()
        for i in habbitIdList:
            cursor.execute("INSERT INTO usersAndHabits VALUES(?,?)",(userID,i))
        conn.commit()
        result = {
            "Stats" : "Update Successful !"
        }
        response = make_response(jsonify(result),201)
        return response
            
            
#獲取對應使用者運動/上傳運動
@userControl_blueprint.route('/UserSports',methods=['GET','POST'])
def sports():
    if request.method == "GET":
        id = request.args.get('ID')
        if id == None:
            id = request.args.get('id')
        if id == None:
            dt = Sport("-1","Index Error. Please Follow Documentaion Instructions")
            response = make_response(jsonify(dt.to_dict()),404)
            return response  
        sports = []
        if checkUserExits(id) == False:
            sport = Sport(-1,"Undefine User")
            sports.append(sport.to_dict())
            response = make_response(jsonify(sports),200)
            return response
        sql_query = """
        SELECT * FROM sports where sports.id in 
        (select sportID from usersAndSports where userID=?)
        """ 
        cursor.execute(sql_query,id)
        data = cursor.fetchall()
        for i in data:
            sport = Sport(i[0],i[1])
            sports.append(sport.to_dict())
        response = make_response(jsonify(sports),404)
        return response
    if request.method == "POST":
        '''
        {
        "userID : "id"
        "sportIDs" : "sportsIDList"
        }
        '''
        data = request.get_json();
        userID = data.get('userID')
        if userID == None:
            result = {
            "Stats" : "Index Error. Please Follow Documentaion Instructions"
            }
            response = make_response(jsonify(result),404)
            return response
        if checkUserExits(id) == False < 1:
            result = {
                "Stats" : "No user"
            }
            response = make_response(jsonify(result),404)
            return response
        sportIdList = data.get('sportIDs')
        cursor.execute("DELETE From usersAndSports where userID = ?",[userID])
        conn.commit()
        for i in sportIdList:
            cursor.execute("INSERT INTO usersAndSports VALUES(?,?)",(userID,i))
        conn.commit()
        result = {
            "Stats" : "Update Successful !"
        }
        response = make_response(jsonify(result),201)
        return response
    
@userControl_blueprint.route('/GetDailySportsSuggestion',methods=['POST'])
def getDailySportsSuggestion():
    requestData = request.get_json()
    id = int(requestData.get('userID'))
    longtitude = float(requestData.get('longitude'))
    latitude = float(requestData.get('latitude'))
    sports = []
    if id == None or longtitude == None or longtitude == None:
        sport = Sport(-1,"Index Error. Please Follow Documentaion Instructions")
        sports.append(sport.to_dict())
        response = make_response(jsonify(sports),404)
        return response
    if checkUserExits(id) == False < 1:
        sport = Sport(-1,"Undefine User")
        sports.append(sport.to_dict())
        response = make_response(jsonify(sports),404)
        return response
    sql_query = """
    SELECT * FROM sports where sports.id in 
    (select sportID from usersAndSports where userID=?)
    """ 
    cursor.execute(sql_query,[id])
    sportsData = cursor.fetchall()
    nowWeatherData = dataHandler.weatherData.get12hData(longtitude,latitude,"")[0]
    sportsSuggestion = getSportsSuggestion(nowWeatherData)
    suggestionResult = []
    for sportData in sportsData:
        tp = SportsSuggestion(sportData[1],sportsSuggestion[sportData[0]-1])
        suggestionResult.append(tp.to_dict())
    response = make_response(jsonify(suggestionResult),200)
    return response

@userControl_blueprint.route('/GetDailyHabitsSuggestion',methods=['POST'])
def getDailyHabitsSuggestion():
    requestData = request.get_json()
    id = int(requestData.get('userID'))
    longtitude = float(requestData.get('longitude'))
    latitude = float(requestData.get('latitude'))
    habits = []
    if id == None or longtitude == None or longtitude == None:
        habit = Habit(-1,"Index Error. Please Follow Documentaion Instructions")
        habits.append(habit.to_dict())
        response = make_response(jsonify(habits),404)
        return response
    if checkUserExits(id) == False:
        habit = Habit(-1,"Undefine User")
        habits.append(habit.to_dict())
        response = make_response(jsonify(habits),404)
        return response
    sql_query = """
    SELECT * FROM habits where habits.id in 
    (select habitID from usersAndHabits where userID=?)
    """ 
    cursor.execute(sql_query,[id])
    habitsData = cursor.fetchall()
    nowWeatherData = dataHandler.weatherData.get12hData(longtitude,latitude,"")[0]
    habitSuggestions = getHabitsSuggestion(nowWeatherData)
    suggestionResult = []
    for habitData in habitsData:
        tp = HabitsSuggestion(habitData[0],habitSuggestions[habitData[0]-1])
        suggestionResult.append(tp.to_dict())
    response = make_response(jsonify(suggestionResult),200)
    return response

@userControl_blueprint.route('/GetAllHabitsOption' , methods=['GET'])
def getAllHabitsOption():
    sql_query = """
    select * from habits
    """
    cursor.execute(sql_query)
    dataSet = cursor.fetchall()
    result = []
    for data in dataSet:
        result.append(Habit(data[0],data[1]).to_dict())
    response = make_response(jsonify(result),200)
    return response

@userControl_blueprint.route('/GetAllSportsOption' , methods=['GET'])
def getAllSportsOption():
    sql_query = """
    select * from sports
    """
    cursor.execute(sql_query)
    dataSet = cursor.fetchall()
    result = []
    for data in dataSet:
        result.append(Sport(data[0],data[1]).to_dict())
    response = make_response(jsonify(result),200)
    return response



    