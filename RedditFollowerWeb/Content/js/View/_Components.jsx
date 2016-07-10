// User List
var UserList = React.createClass({
    render: function () {
        var userEntries = this.props.userList.map((user) => <UserEntry key={user.UserId} user={user}/>)
        return (
            <ul className="users">{userEntries}</ul>
        )
    }
});

var UserEntry = React.createClass({
    handleClick: function() {
        Observer.publish("UserEntryButtonClick", this.props.user)
    },
    render: function () {
        var user = this.props.user
        var className = this.props.user.isSuccess ? "user" : "user-failure"
        return (
        <li className={className} onClick={this.handleClick}>
            {user.Username}
        </li>
    )}
});

// User Info Box 
var UserInfoBox = React.createClass({
    render: function () {
        var user = this.props.user
        if (user == null) {
            return (
                <div></div>
            )
        }
        var status = this.getUserStatus(user.HttpCode)
        return (
            <ul className="user-info-box">
                <li className="user-info">
                    User Id: {user.UserId}
                </li>
                <li className="user-info">
                    Username: {user.Username}
                </li>
                <li className="user-info">
                    Load Status: {status}
                </li>
            </ul>
        )
    },
    getUserStatus(httpCode) {
        if (httpCode == null) {
            return "Not yet loaded"
        } else if (httpCode == 200) {
            return "Loaded"
        } else {
            return "Load Failed - HTTP Error Code is " + user.HttpCode
        }
    },
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

var DashboardButtons = React.createClass({
    render: function () {
        var loadButtonText = LoadingButtonModel.displayText
        var addUserHidden = false
        return (
            <div>
                <DashboardButton id="load-button" content={loadButtonText} eventName="LoadButtonClick" />
                <DashboardButton id="add-user-button" content="Add User" eventName="AddUserButtonClick" />
            </div>
        )
    }
})

class DashboardButton extends React.Component {
    constructor() {
        super()
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        Observer.publish(this.props.eventName)
    }
    render() {
        return (
            <div onClick={this.handleClick} className="btn">
            {this.props.content}
            </div>
        )
    }
}

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

// Add User Button
class AddUserButton extends React.Component {
    constructor() {
        super()
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        Observer.publish("AddUserButtonClick")
    }
    render() {
        return (
            <div onClick={this.handleClick} className="btn">
                Add User
            </div>
        )
    }
}