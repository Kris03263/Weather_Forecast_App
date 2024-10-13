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
    
class DailySuggestion():
    def __init__(self,nowWeatherData):
        self.nowWeatherData = nowWeatherData
    def getSportsSuggestion(self):
        nowRainRate = self.nowWeatherData["rainRate"]
        nowPM = self.nowWeatherData["pm2.5"]
        nowAirQuality = self.nowWeatherData["aqi"]
        nowTemp = self.nowWeatherData["temp"]
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
    
    def getHabitsSuggestion(self):
        nowRainRate = self.nowWeatherData["rainRate"]
        nowAirQuality = self.nowWeatherData["aqi"]
        nowTemp = self.nowWeatherData["temp"]
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
            dessertSuggestion ="Today has nice weather, but still a good choic for doing dessert!"
            gameSuggestion ="Today has nice weather, but still a good choic for playing game!"
            hikingSuggestion ="Today has nice weather to go hiking!"
            mountainSuggestion ="Today has nice weather to go mountain climbing!"
            outdoorSuggestion ="Today has nice weather for outdoor activity!"
        if int(nowTemp) > 30:
            hikingSuggestion = "Today is hot day, if you wanna go hiking, don't forget drink water!"
            mountainSuggestion = "Today is hot day, if you wanna go mountain climbing, don't forget drink water!"
            outdoorSuggestion = "Today is hot day, if you have some outdoor activity, don't forget drink water!"
        if nowAirQuality != None and  int(nowAirQuality) >100:
            hikingSuggestion = "Today has bad air quality, we suggest you do not go hiking"
            mountainSuggestion = "Today has bad air quality, we suggest you do not go mountain climbing"
            outdoorSuggestion = "Today has bad air quality, wearing mask if you have outdoor activity"
        result.append(dessertSuggestion)
        result.append(hikingSuggestion)
        result.append(mountainSuggestion)
        result.append(gameSuggestion)
        result.append(outdoorSuggestion)
        result.append(studySuggestion)
        return result
    
    def getDressingSuggestion(self):
        nowRainRate = self.nowWeatherData["rainRate"]
        nowTemp = self.nowWeatherData["temp"]
        result = ""
        if(int(nowTemp) > 30):
            result += "It's hot today, so you can wear less clothes. ";
        elif (int(nowTemp) <=30 and int(nowTemp) >20):
            result += "The weather is cool today, don’t forget to bring extra coats. "
        else:
            result += "It's a very cold day today, don't go out and put on your coat. "
        if(int(nowRainRate) >= 60):
            reuslt += "And don't forget bring your umbrella!"
        return result
    
    def getHealthSuggestion(self):
        nowPM = self.nowWeatherData["pm2.5"]
        nowBodyTemp = self.nowWeatherData["bodyTemp"]
        result = ""
        if(nowPM != None and int(nowPM) > 15):
            result += "The air is not good today, remember to wear a mask. "
        else:
            result += "The air is good today. "
        if(nowBodyTemp != None and int(nowBodyTemp) > 30):
            result += "And don't forget drink more water! because of hot day!"
        else:
            result += "And remember drinking water is good for your health! "
        
        return result

    def getTransportationSuggestion(self):
        nowRainRate = self.nowWeatherData["rainRate"]
        result = ""
        if(int(nowRainRate) > 50):
            result += "It may rain today, you can try driving or taking public transportation"
        else:
            result += "It won't rain very much today. You can commute by bicycle or by walking."
        return result



