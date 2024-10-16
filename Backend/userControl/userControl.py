from flask import Blueprint,request,jsonify,make_response
import sqlite3
from .Models import UserDataResult,Habit,Sport,SportsSuggestion,HabitsSuggestion,DailySuggestion
import dataHandler.weatherData
from flask_cors import CORS
import dataHandler.boroughData as b

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
        response = make_response(jsonify(sports),200)
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
        if checkUserExits(userID) == False:
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
    
@userControl_blueprint.route('/GetDailySuggestion',methods=['POST'])
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
    sql_query2 = """
    SELECT * FROM habits where habits.id in 
    (select habitID from usersAndHabits where userID=?)
    """ 
    cursor.execute(sql_query,[id])
    sportsData = cursor.fetchall()
    cursor.execute(sql_query2,[id])
    habitsData = cursor.fetchall()
    nowWeatherData = dataHandler.weatherData.get12hData(longtitude,latitude,"")[0]
    handler = DailySuggestion(nowWeatherData)
    sportsSuggestions = handler.getSportsSuggestion()
    sportSuggestionResult = []
    for sportData in sportsData:
        tp = SportsSuggestion(sportData[1],sportsSuggestions[sportData[0]-1])
        sportSuggestionResult.append(tp.to_dict())
    habitSuggestions = handler.getHabitsSuggestion()
    habitSuggestionResult = []
    for habitData in habitsData:
        tp = HabitsSuggestion(habitData[1],habitSuggestions[habitData[0]-1])
        habitSuggestionResult.append(tp.to_dict())
    final_dict = {}
    dressing_dict = [{"name": "衣著", "suggestion" : handler.getDressingSuggestion()}]
    health_dict = [{"name": "健康", "suggestion" : handler.getHealthSuggestion()}]
    tansportation_dict = [{"name": "交通", "suggestion" : handler.getTransportationSuggestion()}]
    final_dict["dressing"] = dressing_dict
    final_dict["health"] = health_dict
    final_dict["transportation"] = tansportation_dict
    final_dict["sport"] = sportSuggestionResult
    final_dict["habit"] = habitSuggestionResult
    response = make_response(jsonify(final_dict),200)
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

@userControl_blueprint.route('/GetAllRegion', methods=['GET'])
def getAllRegion():
    return jsonify(b.GetBoroughCode())


    