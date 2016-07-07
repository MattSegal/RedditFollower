﻿// User List
var UserList = React.createClass({
    render: function () {
        var userEntries = this.props.userList.map((user) => <UserEntry key={user.UserId} user={user}/>)
        return (
            <ul className="users">{userEntries}</ul>
        )
    }
});

var UserEntry = React.createClass({
    render: function () {
        var user = this.props.user
        var className = this.props.user.isSuccess ? "user" : "user-failure"
        return (
        <li className={className}>
            {user.Username}
        </li>
    )}
});

// User Info 
// this name is kind of shit
// this component is kind of shit
var UserListInfo = React.createClass({
    render: function () {
        if (this.props.infoText) {
            return (
                <ul className="users">
                    <li className="btn">
                        {this.props.infoText}
                    </li>
                </ul>
            )
        } else {
            return (
                <ul className="users">
                </ul>
            )
        }
    }
});

// Thread List
var ThreadList = React.createClass({
    render: function () {
        var threads = this.props.threadList.map((thread) => <ThreadEntry key={thread.RedditThreadId} thread={thread }/>)
    return (
        <ul>
            {threads}
        </ul>
    )}
});

var ThreadEntry = React.createClass({
    render: function () {
        var thread = this.props.thread
        var subredditLink = "http://www.reddit.com/r/" + thread.Subreddit
        var authors = thread.CommentAuthors.map((author) => <ThreadAuthor key={author} authorName={author}/>)
        return (
        <li className="thread">
            <div className="left-side">
                <a href={thread.Url}>{thread.Title}</a>
                <div className="authors">
                    {authors}
                </div>
            </div>
            <div className="right-side">
                <div className="subreddit">
                    <a href={subredditLink}>
                        {thread.Subreddit}
                    </a>
                </div>
            </div>
        </li>
    )}
});

var ThreadAuthor = React.createClass({
    render: function () {
        return (
        <span>{this.props.authorName}</span>
    )}
});

// Load From Api Button
class LoadButton extends React.Component {
    constructor() {
        super()
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        Observer.publish("LoadButtonClick")
    }
    render() {
        return (
            <div onClick={this.handleClick} className="btn">
                {this.props.content}
            </div>
        )
    }
}