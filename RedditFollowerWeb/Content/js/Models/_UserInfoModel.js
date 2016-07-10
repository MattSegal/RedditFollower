var UserInfoModel = {
    currentUser: null,
    isOpen: function () {
        return this.currentUser != null
    },
    open: function (user) {
        this.currentUser = user.Username
        this._publishUpdate()
    },
    close: function () {
        this.currentUser = null
        this._publishUpdate()
    },
    _publishUpdate: function () {
        Observer.publish("UserInfoModelUpdate")
    },
}

