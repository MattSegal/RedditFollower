var UserModel = {
    _users: {
        // fields: UserId, Username, HttpCode, isSuccess
        // UserId is implicitly generated client side by ordering of users
        "gwern": { "UserId": 0 },
        "The_Amp_Walrus": { "UserId": 1 }
    },
    toArray: function () { return Object.keys(this._users).map((key) => this._users[key]) },
    usernames: function() {return Object.keys(this._users)},
    updateUser: function (userObj) {
        this._users[userObj["Username"]] = userObj
        Observer.publish("UserModelUpdate")
    },
    removeUser: function (username) { delete this[username] }
}

