class userDataResult():
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