var ThreadModel = {
    _threads: {},
    threadIds: function () {
        return Object.keys(this._threads)
    },
    _publishUpdate: function () {
        Observer.publish("ThreadModelUpdate")
    },
    toArray: function() {
        return this.threadIds()
            .map((id) => this._threads[id])
    },
    _updateThread: function (threadObj) {
        var id = threadObj.RedditThreadId
        this._threads[id] = threadObj
    },
    updateThread: function (threadObj) {
        this._updateThread(threadObj)
        this._publishUpdate()
    },
    updateThreads: function (threadObjList) {
        threadObjList.forEach((threadObj) =>
            this._updateThread(threadObj))
        this._publishUpdate()
    },
}