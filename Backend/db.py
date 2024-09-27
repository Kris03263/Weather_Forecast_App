import sqlite3
#This file is created for creating dataTable
conn = sqlite3.connect('Backend/data.sqlite')

cursor = conn.cursor()
conn.execute("PRAGMA foreign_keys = ON;")
sql_delete1 = """DROP TABLE users
"""
sql_delete2 = """DROP TABLE sports
"""
sql_delete3 = """DROP TABLE habits
"""
sql_delete4 = """DROP TABLE usersAndSports
"""
sql_delete5 = """DROP TABLE usersAndHabits
"""
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
cursor.execute(sql_delete1)
cursor.execute(sql_delete2)
cursor.execute(sql_delete3)
cursor.execute(sql_delete4)
cursor.execute(sql_delete5)
cursor.execute(sql_query1)
cursor.execute(sql_query2)
cursor.execute(sql_query3)
cursor.execute(sql_query4)
cursor.execute(sql_query5)
conn.commit()
conn.close()