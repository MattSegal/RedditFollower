var UserModel = {
    // A user has the fields: 
    // UserId       - This is implicitly generated client side by ordering of users
    // Username     - Reddit name of user
    // HttpCode     - Status code of last request
    // isSuccess    - Whether last request was successful
    _users: {},
    toArray: function () { return Object.keys(this._users).map((key) => this._users[key]) },
    usernames: function() {return Object.keys(this._users)},
    updateUser: function (userObj) {
        this._users[userObj["Username"]] = userObj
        Observer.publish("UserModelUpdate")
    },
    updateUsers: function (userObjList) {
        _this = this
        userObjList.map((userObj) =>_this._users[userObj["Username"]] = userObj)
        Observer.publish("UserModelUpdate")
    },
    removeUser: function (username) {
        if (Object.keys(this._users).contains(username)) {
            delete this._users[username]
            Observer.publish("UserModelUpdate")
        } else {
            console.warn("UserModel: no such user as " + username)
        }
    },
    setAllUsersToFailed: function () {
        Object.keys(this._users).map((key) =>_this._users[key]["isSuccess"] = false)
        Observer.publish("UserModelUpdate")
    },
    getMaxUserId: function () {
        _this = this
        return Object.keys(this._users)
            .map((key) => _this._users[key].UserId)
            .reduce((a, b) => Math.max(a, b))
    }
}