/*
A user has the fields: 
    UserId       - This is implicitly generated client side by ordering of users
    Username     - Reddit name of user
    HttpCode     - Status code of last request
    isSuccess    - Whether last request was successful
*/
var UserModel = {
    _users: {},
    usernames: function () {
        return Object.keys(this._users)
    },
    _publishUpdate: function() {
        Observer.publish("UserModelUpdate")
    },
    toArray: function () {
        return this.usernames()
            .map((key) => this._users[key])
    },
    _updateUser: function (userObj) {
        var username = userObj.Username
        this._users[username] = userObj
    },
    updateUser: function (userObj) {
        this._updateUser(userObj)
        this._publishUpdate()
    },
    updateUsers: function (userObjList) {
        userObjList.forEach((userObj) =>
            this._updateUser(userObj))
        this._publishUpdate()
    },
    _addNewUser: function(username) {
        var newUser = {
            UserId: this.getNextUserId(),
            isSuccess: true,
            HttpCode: null,
            Username: username
        }
        this._updateUser(newUser)
    },
    addNewUser: function (username) {
        this._addNewUser(username)
        this._publishUpdate()
    },
    addNewUsers: function (usernames) {
        usernames.forEach((username) => this._addNewUser(username))
        this._publishUpdate()
    },
    removeUser: function (username) {
        if (this.userExists(username)) {
            delete this._users[username]
            this._publishUpdate()
        } else {
            console.warn("UserModel: no such user as " + username)
        }
    },
    getUser: function (username) {
        if (!this.userExists(username)) {
            console.warn("UserModel: no such user as " + username)
        }
        return this._users[username]
    },
    setAllUsersToFailed: function () {
        for (var key in this.usernames()) {
            this._users[key].isSuccess = false
        }
        this._publishUpdate()
    },
    userExists: function(username) {
        return this.usernames().contains(username)
    },
    getNextUserId: function () {
        if (this.usernames().length == 0) {
            return 0
        } else {
            return this.toArray()
                .map((user) => user.UserId)
                .reduce((a, b) => Math.max(a, b)) + 1
        }
    },
}