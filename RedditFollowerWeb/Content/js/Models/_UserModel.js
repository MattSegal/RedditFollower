function RedditUser(userObj) {
    this.UserId     = userObj.UserId, // generated client side, but also overwritten by api sortof
    this.HttpCode   = userObj.HttpCode,
    this.Username   = userObj.Username,
    this.State      = this.getUserState(userObj)
    }

RedditUser.prototype.getUserState = function (userObj) {
    var username = userObj.Username
    var prevState = UserModel.userExists(username) ? UserModel.getUser(username).State : null
    if (prevState === UserState.FILTERED) { return prevState }
    if (userObj.HttpCode === null || userObj.HttpCode === undefined) {
        return UserState.NOT_LOADED
    } else if (userObj.HttpCode === 200) {
        return UserState.LOADED
    } else {
        return UserState.FAILED
    }
} 

var UserModel = {
    _users: {},
    usernames: function () {
        return Object.keys(this._users)
    },
    toArray: function () {
        return this.usernames()
            .map((key) => this._users[key])
    },
    updateUser: function (userObj) {
        var username = userObj.Username
        this._users[username] = new RedditUser(userObj)
    },
    updateUsers: function (userObjList) {
        userObjList.forEach((userObj) =>
            this.updateUser(userObj))
    },
    addNewUser: function (username) {
        if (this.usernames().contains(username)) {return}
        var newUser = {
            UserId: this.getNextUserId(),
            State: UserState.NOT_LOADED,
            HttpCode: null,
            Username: username
        }
        this.updateUser(newUser)
    },
    addNewUsers: function (usernames) {
        usernames.forEach((username) => this.addNewUser(username))
    },
    removeUser: function (username) {
        if (this.userExists(username)) {
            delete this._users[username]
        } else {
            Logger.log("UserModel - removeUser -  no such user as " + username)
        }
    },
    getUser: function (username) {
        if (!this.userExists(username)) {
            Logger.log("UserModel - getUser - no such user as " + username)
        }
        return this._users[username]
    },
    getUsers: function (userList) {
        return this.toArray()
            .filter((user)=> userList.contains(user.Username))
    },
    setAllUsersToFailed: function () {
        for (var key in this.usernames()) {
            this._users[key].State = UserState.FAILED
        }
    },
    userExists: function(username) {
        return this.usernames().contains(username)
    },
    getNextUserId: function () {
        if (this.usernames().length == 0) {
            return 0
        } else {
            return this.toArray(this.usernames())
                .map((user) => user.UserId)
                .reduce((a, b) => Math.max(a, b)) + 1
        }
    },
}