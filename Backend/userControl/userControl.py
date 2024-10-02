from flask import Blueprint,request,jsonify
import sqlite3
from .Models import UserDataResult,Habit,Sport

userControl_blueprint = Blueprint('userControl_blueprint', __name__)
DATABASE = 'Backend/data.sqlite'
conn = sqlite3.connect(DATABASE,check_same_thread=False)

cursor = conn.cursor()

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
    cursor.execute("SELECT * FROM users WHERE account =? and password =?",(userAccount,password))
    user = cursor.fetchall()
    if len(user) == 0:
        dt = UserDataResult("-1","","","no user")
    elif len(user) != 0 and user[0][3] == 1:
        dt = UserDataResult("-1","","","user was deleted")
    else:
        dt = UserDataResult(user[0][0],user[0][1],user[0][2],"successful")
    return jsonify(dt.to_dict()) 
#獲取使用者資料 / 註冊 /刪除
@userControl_blueprint.route('/',methods=['GET','POST','DELETE'])
def register():
    if request.method == 'GET':
        id = request.args.get('id')
        cursor.execute("Select * from users where id =?",[id])
        user = cursor.fetchall()
        if len(user) < 1:
            dt = UserDataResult("-1","","","no user")
            return jsonify(dt.to_dict())
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
        cursor.execute("SELECT * FROM users WHERE account =?",[userAccount])
        user = cursor.fetchall()
        if len(user) > 0:
            dt = UserDataResult("-1","","","Account have been used")
            return jsonify(dt.to_dict())
        cursor.execute("INSERT INTO users(account,password,deleted) VALUES(?,?,?)",(userAccount,password,0))
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE account =? and password =?",(userAccount,password))
        user = cursor.fetchall()
        if(len(user) != 0):
            dt = UserDataResult(user[0][0],user[0][1],user[0][2],"Register Successful")
            return jsonify(dt.to_dict())
        else:
            dt = UserDataResult("-1","","","Register Error")
            return jsonify(dt.to_dict())
    if request.method == 'DELETE':
        '''
        {
        "id" : "userid"
        }
        '''
        data = request.get_json()
        id = data.get('id')
        cursor.execute("UPDATE users SET deleted = 1 where id =?",[id])
        conn.commit()
        result ={
            "status" : "Successful"
        }
        return jsonify(result)
#獲取對應使用者嗜好/上傳嗜好
@userControl_blueprint.route('/UserHabits',methods=['GET','POST'])
def habits():
    if request.method == "GET":
        id = request.args.get('ID')
        cursor.execute("Select * from users where id =?",[id])
        counter = cursor.fetchall()
        habits = []
        if len(counter) < 1:
            habit = Habit(-1,"Undefine User")
            habits.append(habit.to_dict())
            return jsonify(habits)
        sql_query = """
        SELECT * FROM habits where habits.id in 
        (select habitID from usersAndHabits where userID=?)
        """ 
        cursor.execute(sql_query,id)
        data = cursor.fetchall()
        for i in data:
            habit = Habit(i[0],i[1])
            habits.append(habit.to_dict())
        return jsonify(habits)
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
        cursor.execute("DELETE From usersAndHabits where userID = ?",(userID))
        conn.commit()
        for i in habbitIdList:
            cursor.execute("INSERT INTO usersAndHabits VALUES(?,?)",(userID,i))
        conn.commit()
        result = {
            "Stats" : "Update Successful !"
        }
        return jsonify(result)
            
            
#獲取對應使用者運動/上傳運動
@userControl_blueprint.route('/UserSports',methods=['GET','POST'])
def sports():
    if request.method == "GET":
        id = request.args.get('ID')
        cursor.execute("Select * from users where id =?",[id])
        counter = cursor.fetchall()
        sports = []
        if len(counter) < 1:
            sport = Sport(-1,"Undefine User")
            sports.append(sport.to_dict())
            return jsonify(sports)
        sql_query = """
        SELECT * FROM sports where sports.id in 
        (select sportID from usersAndSports where userID=?)
        """ 
        cursor.execute(sql_query,id)
        data = cursor.fetchall()
        for i in data:
            sport = Sport(i[0],i[1])
            sports.append(sport.to_dict())
        return jsonify(sports)
    if request.method == "POST":
        '''
        {
        "userID : "id"
        "sportIDs" : "sportsIDList"
        }
        '''
        data = request.get_json();
        userID = data.get('userID')
        sportIdList = data.get('sportIDs')
        cursor.execute("DELETE From usersAndSports where userID = ?",(userID))
        conn.commit()
        for i in sportIdList:
            cursor.execute("INSERT INTO usersAndSports VALUES(?,?)",(userID,i))
        conn.commit()
        result = {
            "Stats" : "Update Successful !"
        }
        return jsonify(result)
    
            
            
    


    