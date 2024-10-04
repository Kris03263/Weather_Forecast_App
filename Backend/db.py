import sqlite3
#This file is created for creating dataTable
conn = sqlite3.connect('data.sqlite')
sport_data = [
    [1,'籃球'],
    [2,'羽球'],
    [3,'排球'],
    [4,'游泳'],
    [5,'公路車'],
    [6,'慢跑'],
    [7,'桌球']
]
habit_data = [
    [1,'做甜點'],
    [2,'健行'],
    [3,'登山'],
    [4,'玩遊戲'],
    [5,'出遊'],
    [6,'閱讀'],
]
cursor = conn.cursor()
conn.execute("PRAGMA foreign_keys = ON;")
sql_query1 = """CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account TEXT NOT NULL,
    password TEXT NOT NULL,
    deleted INTEGER NOT NULL);"""

sql_query2 = """CREATE TABLE IF NOT EXISTS sports(
    id INTEGER PRIMARY KEY,
    sportName TEXT NOT NULL
);
"""

sql_query3 = """CREATE TABLE IF NOT EXISTS habits(
    id INTEGER PRIMARY KEY,
    habitName TEXT NOT NULL
);
"""

sql_query4 = """CREATE TABLE IF NOT EXISTS usersAndSports(
    userID INTEGER NOT NULL,
    sportID INTEGER NOT NULL,
    PRIMARY KEY(userID,sportID),
    FOREIGN KEY(userID) references users(ID),
    FOREIGN KEY(sportID) references sports(ID)
);"""

sql_query5 = """CREATE TABLE IF NOT EXISTS usersAndHabits(
    userID INTEGER NOT NULL,
    habitID INTEGER NOT NULL,
    PRIMARY KEY(userID,habitID),
    FOREIGN KEY(userID) references users(ID),
    FOREIGN KEY(habitID) references habits(ID)
);""" 
cursor.execute(sql_query1)
cursor.execute(sql_query2)
cursor.execute(sql_query3)
cursor.execute(sql_query4)
cursor.execute(sql_query5)
for i in habit_data:
    cursor.execute("Insert Into habits values(?,?)",(i[0],i[1]))
for i in sport_data:
    cursor.execute("Insert Into sports values(?,?)",(i[0],i[1]))
conn.commit()
conn.close()