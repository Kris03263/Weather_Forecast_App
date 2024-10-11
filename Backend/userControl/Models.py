class UserDataResult():
    def __init__(self,id,account,password,status):
        self.id = id
        self.account = account
        self.password = password
        self.status = status
    def to_dict(self):
        return {
            "id": self.id,
            "account" : self.account,
            "password": self.password,
            "status": self.status
        }
class Habit():
    def __init__(self,id,habitName):
        self.id = id
        self.habitName = habitName
    def to_dict(self):
        return {
            "id": self.id,
            "habitName" : self.habitName
        }
class Sport():
    def __init__(self,id,sportName):
        self.id = id
        self.sportName = sportName
    def to_dict(self):
        return {
            "id": self.id,
            "sportName" : self.sportName
        }
class SportsSuggestion():
    def __init__ (self,sportName,sportSuggestion):
        self.sportName = sportName
        self.sportSuggestion = sportSuggestion
    def to_dict(self):
        return {
                "sportName": self.sportName,
                "sportSuggestion" : self.sportSuggestion
            }
    
class HabitsSuggestion():
    def __init__(self,habitName,habitSuggestion):
        self.habitName = habitName
        self.habitSuggestion = habitSuggestion
    def to_dict(self):
        return {
                "habitName": self.habitName,
                "habitSuggestion" : self.habitSuggestion
                }