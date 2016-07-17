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
    },
    updateUsers: function (userObjList) {
        userObjList.forEach((userObj) =>
            this._updateUser(userObj))
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
    },
    addNewUsers: function (usernames) {
        usernames.forEach((username) => this._addNewUser(username))
    },
    removeUser: function (username) {
        if (this.userExists(username)) {
            delete this._users[username]
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