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