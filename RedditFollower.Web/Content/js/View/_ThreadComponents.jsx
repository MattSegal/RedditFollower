// Thread List
var ThreadList = React.createClass({
    render: function () {
        var unfilteredUsernames = UserModel.getUsers(this.props.userList)
            .filter((user) => user.State != UserState.FILTERED)
            .map((user) => user.Username)
        var threadList = ThreadModel.getThreads(unfilteredUsernames)
        var threads = threadList
            .sort((a, b) => b.lastCommentTime() - a.lastCommentTime())
            .map((thread) => <ThreadEntry key={thread.RedditThreadId} thread={thread} />)
        return (
            <ul className="thread-list">
                {threads}
            </ul>
        )
    }
});

var ThreadEntry = React.createClass({
    getInitialState: function () {
        return ({
            currentUser: null,
        })
    },
    userClick: function (username) {
        this.setState({
            currentUser: this.state.currentUser === username ? null : username,
        })
    },
    render: function () {
        var thread = this.props.thread
        var comments = thread.Comments
            .filter((comment) => comment.Author === this.state.currentUser)
            .map((comment) => <ThreadComment key={comment.CrearedUtc} comment={comment } />) 
        var commentList = comments.length > 0 ? commentList = <div className="comment-list">{comments}</div> : null
        var subredditLink = "http://www.reddit.com/r/" + thread.Subreddit
        var authors = thread.CommentAuthors
            .map((author) => <ThreadAuthor key={author} onClick={this.userClick} authorName={author } />)
        return (
            <li className="thread">
                <div className="left-side">
                    <a href={thread.Url}>{thread.Title}</a>
                    <div className="authors">
                        {authors}
                    </div>
                    {commentList}
                </div>
                <div className="right-side">
                    <div className="subreddit">
                        <a href={subredditLink}>
                            {thread.Subreddit}
                        </a>
                    </div>
                </div>
            </li>
        )
    }
});

var ThreadComment = React.createClass({
    render: function () {
        console.log(this.props.comment.Body)
        return (
            <div className="comment" dangerouslySetInnerHTML={{ __html: this.props.comment.Body } } />
        )
    }
})

var ThreadAuthor = React.createClass({
    render: function () {
        return (
        <span onClick={this.props.onClick.bind(null,this.props.authorName)}>{this.props.authorName}</span>
    )
    }
});
