var ThreadModel = {
    _threads: {},
    threadIds: function () {
        return Object.keys(this._threads)
    },
    toArray: function(userList) {
        return this.threadIds()
            // map only threads with current users
            .map((id) => this._threads[id])
    },
    _updateThread: function (threadObj) {
        var id = threadObj.RedditThreadId
        this._threads[id] = threadObj
    },
    updateThread: function (threadObj) {
        this._updateThread(threadObj)
    },
    updateThreads: function (threadObjList) {
        threadObjList.forEach((threadObj) =>
            this._updateThread(threadObj))
    },
}