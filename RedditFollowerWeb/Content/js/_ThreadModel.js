var ThreadModel = {
    _threads: {},
    toArray: function () { return Object.keys(this._threads).map((x) => this._threads[x]) },
    threadIds: function () { return Object.keys(this._threads) },
    updateThread: function (threadObj) {
        this._threads[threadObj["RedditThreadId"]] = threadObj
        Observer.publish("ThreadModelUpdate")
    },
    updateThreads: function (threadObjList) {
        _this = this
        threadObjList.map((threadObj) =>_this._threads[threadObj["RedditThreadId"]] = threadObj)
        Observer.publish("ThreadModelUpdate")
    },
}