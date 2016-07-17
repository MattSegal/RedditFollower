var LoadingButtonModel = {
    isLoading: false,
    displayText: "Load user links",
    startLoading: function () {
        this.isLoading = true
        this.displayText = "Loading links..."
        this._publishUpdate()
    },
    stopLoading: function () {
        this.isLoading = false
        this.displayText = "Load user links"
        this._publishUpdate()
    },
    _publishUpdate: function () {
        Observer.publish("LoadingModelUpdate")
    },
}

var AddUserButtonModel = {
    isInDashbuttons: true,
    openAddUserDialogue: function () {
        this.isInDashbuttons = false
        this.isInDialogue = this.isInDashbuttons ? false : true
        this._publishUpdate()
    },
    closeAddUserDialogue: function () {
        this.isInDashbuttons = true
        this.isInDialogue = this.isInDashbuttons ? false : true
        this._publishUpdate()
    },
    hide: function() {
        this.isInDashbuttons = false
        this.isInDialogue = false
        this._publishUpdate()
    },
    _publishUpdate: function () {
        Observer.publish("AddUserModelUpdate")
    },
}