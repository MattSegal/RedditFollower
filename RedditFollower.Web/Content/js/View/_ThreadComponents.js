// Thread List
"use strict";

var ThreadList = React.createClass({
    displayName: "ThreadList",

    render: function render() {
        var unfilteredUsernames = UserModel.getUsers(this.props.userList).filter(function (user) {
            return user.State != UserState.FILTERED;
        }).map(function (user) {
            return user.Username;
        });
        var threadList = ThreadModel.getThreads(unfilteredUsernames);
        var threads = threadList.sort(function (a, b) {
            return b.lastCommentTime() - a.lastCommentTime();
        }).map(function (thread) {
            return React.createElement(ThreadEntry, { key: thread.RedditThreadId, thread: thread });
        });
        return React.createElement(
            "ul",
            { className: "thread-list" },
            threads
        );
    }
});

var ThreadEntry = React.createClass({
    displayName: "ThreadEntry",

    getInitialState: function getInitialState() {
        return {
            currentUser: null
        };
    },
    userClick: function userClick(username) {
        this.setState({
            currentUser: this.state.currentUser === username ? null : username
        });
    },
    render: function render() {
        var _this = this;

        var thread = this.props.thread;
        var comments = thread.Comments.filter(function (comment) {
            return comment.Author === _this.state.currentUser;
        }).map(function (comment) {
            return React.createElement(ThreadComment, { key: comment.CrearedUtc, comment: comment });
        });
        var commentList = comments.length > 0 ? commentList = React.createElement(
            "div",
            { className: "comment-list" },
            comments
        ) : null;
        var subredditLink = "http://www.reddit.com/r/" + thread.Subreddit;
        var authors = thread.CommentAuthors.map(function (author) {
            return React.createElement(ThreadAuthor, { key: author, onClick: _this.userClick, authorName: author });
        });
        return React.createElement(
            "li",
            { className: "thread" },
            React.createElement(
                "div",
                { className: "left-side" },
                React.createElement(
                    "a",
                    { href: thread.Url },
                    thread.Title
                ),
                React.createElement(
                    "div",
                    { className: "authors" },
                    authors
                ),
                commentList
            ),
            React.createElement(
                "div",
                { className: "right-side" },
                React.createElement(
                    "div",
                    { className: "subreddit" },
                    React.createElement(
                        "a",
                        { href: subredditLink },
                        thread.Subreddit
                    )
                )
            )
        );
    }
});

var ThreadComment = React.createClass({
    displayName: "ThreadComment",

    render: function render() {
        console.log(this.props.comment.Body);
        return React.createElement("div", { className: "comment", dangerouslySetInnerHTML: { __html: this.props.comment.Body } });
    }
});

var ThreadAuthor = React.createClass({
    displayName: "ThreadAuthor",

    render: function render() {
        return React.createElement(
            "span",
            { onClick: this.props.onClick.bind(null, this.props.authorName) },
            this.props.authorName
        );
    }
});

