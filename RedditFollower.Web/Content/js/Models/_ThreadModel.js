function Comment(commentObj) {
    // not in use atm
    this.Body           = commentObj.Body;
    this.RedditId       = commentObj.RedditId;
    this.RedditLinkId   = commentObj.RedditLinkId;
    this.Author         = commentObj.Author;
    this.Score          = commentObj.Score;
    this.Downvotes      = commentObj.Downvotes;
    this.CreatedUtc     = commentObj.CreatedUtc;
}

function Thread(threadObj) {
    this.Url            = threadObj.Url
    this.RedditThreadId = threadObj.RedditThreadId
    this.IsSelfPost     = threadObj.IsSelfPost
    this.Subreddit      = threadObj.Subreddit
    this.Author         = threadObj.Author
    this.Score          = threadObj.Score
    this.NumComments    = threadObj.NumComments
    this.Permalink      = threadObj.Permalink
    this.CreatedUtc     = threadObj.CreatedUtc
    this.Title          = threadObj.Title
    this.Comments       = threadObj.Comments
    this.CommentAuthors = threadObj.CommentAuthors
}

Thread.prototype.lastCommentTime = function() {
    return this.Comments
        .map((c) => Number(c.CreatedUtc))
        .reduce((max, cur) => Math.max(max, cur), 0)
}

Thread.prototype.containsActiveUser = function (activeUserList) {
    return this.Comments
        .map((comment) => activeUserList.contains(comment.Author))
        .reduce((prev, cur) =>prev || cur, false)
}

var ThreadModel = {
    _threads: {},
    threadIds: function () {
        return Object.keys(this._threads)
    },
    toArray: function() {
        return this.threadIds()
            .map((id) => this._threads[id])
    },
    getThreads: function (userList) {
        return this.toArray()
            .filter((thread) => thread.containsActiveUser(userList))
    },  
    updateThread: function (threadObj) {
        var id = threadObj.RedditThreadId
        this._threads[id] = new Thread(threadObj)
    },
    updateThreads: function (threadObjList) {
        threadObjList.forEach((threadObj) =>
            this.updateThread(threadObj))
    },
}