from flask import Blueprint,request,jsonify
import sqlite3
from .Models import userDataResult

userControl_blueprint = Blueprint('userControl_blueprint', __name__)
DATABASE = 'Backend/data.sqlite'
conn = sqlite3.connect(DATABASE,check_same_thread=False)

cursor = conn.cursor()


@userControl_blueprint.route('/login',methods=['POST'])
def login():
    data = request.get_json()
    userAccount = data.get('userAccount')
    password = data.get('password')
    cursor.execute("SELECT * FROM users WHERE account =? and password =?",(userAccount,password))
    user = cursor.fetchall()
    if len(user) == 0:
        dt = userDataResult("-1","","","no user")
    elif len(user) != 0 and user[0][3] == 1:
        dt = userDataResult("-1","","","user was deleted")
    else:
        dt = userDataResult(user[0][0],user[0][1],user[0][2],"successful")
    return jsonify(dt.to_dict()) 

@userControl_blueprint.route('/',methods=['POST','DELETE'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        userAccount = data.get('userAccount')
        password = data.get('password')
        cursor.execute("SELECT * FROM users WHERE account =?",[userAccount])
        user = cursor.fetchall()
        if len(user) > 0:
            dt = userDataResult("-1","","","Account have been used")
            return jsonify(dt.to_dict())
        cursor.execute("INSERT INTO users(account,password,deleted) VALUES(?,?,?)",(userAccount,password,0))
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE account =? and password =?",(userAccount,password))
        user = cursor.fetchall()
        if(len(user) != 0):
            dt = userDataResult(user[0][0],user[0][1],user[0][2],"Register Successful")
            return jsonify(dt.to_dict())
        else:
            dt = userDataResult("-1","","","Register Error")
            return jsonify(dt.to_dict())
    if request.method == 'DELETE':
        data = request.get_json()
        id = data.get('id')
        cursor.execute("UPDATE users SET deleted = 1 where id =?",[id])
        conn.commit()
        result ={
            "status" : "Successful"
        }
        return jsonify(result)
    


    