var UserList = React.createClass({
    render: function () {
        var userEntries = this.props.userList
            .map((username) => UserModel.getUser(username))
            .map((user) => <User handleClick={this.props.userClick} key={user.UserId} user={user } />)
        return (
            <ul className="users">{userEntries}</ul>
        )
    }
});

var User = React.createClass({
    render: function () {
        var user = this.props.user
        var className = this.props.user.isSuccess ? "user" : "user-failure"
        return (
        <li className={className} onClick={this.props.handleClick.bind(null,user.Username)}>
            {user.Username}
        </li>
        )
    }
});

var UserInfoBox = React.createClass({
    render: function () {
        var currentUser = this.props.currentUser
        var user = UserModel.userExists(currentUser) ? UserModel.getUser(currentUser) : null
        if (user == null) {
            return (<div></div>)
        }
        var removeUserStyle = { margin: "5px" }
        var status = this.getUserStatus(user.HttpCode)
        return (
            <ul className="user-info-box">
                <li className="user-info">
                    <span>User Id:</span>{user.UserId}
                </li>
                <li className="user-info">
                    <span>Username:</span>{user.Username}
                </li>
                <li className="user-info">
                    <span>Load Status:</span>{status}
                </li>
                <DashboardButton id="remove-user-button" content="Remove User" eventName="RemoveUserClick" style={removeUserStyle} />
            </ul>
        )
    },
    getUserStatus(httpCode) {
        if (httpCode == null) {
            return "Not yet loaded"
        } else if (httpCode == 200) {
            return "Loaded"
        } else {
            return "Load Failed - HTTP Error Code is " + httpCode
        }
    },
});

// Thread List
var ThreadList = React.createClass({
    render: function () {
        var threadList = ThreadModel.toArray()
        var threads = threadList
            .sort((a, b) => a.CreatedUtc - b.CreatedUtc) // dont sort by thread, sort by last comment
            .map((thread) => <ThreadEntry key={thread.RedditThreadId} thread={thread } />)
        return (
        <ul>
            {threads}
        </ul>
    )
    }
});

var ThreadEntry = React.createClass({
    render: function () {
        var thread = this.props.thread
        var subredditLink = "http://www.reddit.com/r/" + thread.Subreddit
        var authors = thread.CommentAuthors.map((author) => <ThreadAuthor key={author} authorName={author } />)
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
    )
    }
});

var ThreadAuthor = React.createClass({
    render: function () {
        return (
        <span>{this.props.authorName}</span>
    )
    }
});

var AddUserBox = React.createClass({
    addUser: function() {
        // get a username
        var username = "foo"
        this.props.addUserClick(username)
    },
    cancelAddUser: function () {
        this.props.addUserClick(null)
    },
    render: function () {
        return (
            <div className="user-info-box">
                <input id="new-user-name" type="text" placeholder="Enter username here." />
                <DashboardButton id="add-user-button" content="Add User" style={{}} handleClick={this.addUser}/>
                <DashboardButton id="cancel-add-user-button" content="Cancel" style={{}} handleClick={this.cancelAddUser} />
            </div>
        )
    }
})


var DashboardButtons = React.createClass({
    render: function () {
        var loadButtonText = this.props.isLoading ? "Loading links..." : "Load user links"
        var addUserButtonStyle = this.props.addUserDialogue ? { display: "none" } : {}
        return (
            <div>
                <DashboardButton id="load-button" content={loadButtonText} handleClick={this.props.loadButtonClick} />
                <DashboardButton id="add-user-button" content="Add User" style={addUserButtonStyle} handleClick={this.props.addUserClick} />
            </div>
        )
    }
})

var DashboardButton = React.createClass({
    render: function() {
        return (
            <div onClick={this.props.handleClick} className="btn" style={this.props.style}>
                {this.props.content}
            </div>
        )
    }
})

var infoBox = {
    CLOSED: 0,
    ADD_USER: 1,
    USER_INFO: 2,
}

var View = React.createClass({
    
    getInitialState: function () {
        return ({
            userList: [
                "The_Amp_Walrus",
                "yodatsracist",
                "ScottAlexander"
            ],
            currentUser: null,
            isLoading: false,
            infoBox: infoBox.CLOSED,
        })
    },
    loadData: function() {
        this.setState({
            isLoading: true,
            infoBox: infoBox.CLOSED,
            currentUser: null
        })
        setTimeout(this.onDataLoad,1000)
    },
    onDataLoad: function () {
        this.setState({ isLoading: false })
    },
    addUser: function (username) {
        if (this.state.buttonsLocked) { return }
        if (this.state.infoBox === infoBox.ADD_USER && username) {
            console.log(username)
        } 
        this.setState({
            infoBox: this.state.infoBox === infoBox.ADD_USER ? infoBox.CLOSED : infoBox.ADD_USER,
            currentUser: null
        })
    },
    userClick: function(username) {
        if (this.state.buttonsLocked) { return }
        this.setState({
            currentUser: this.state.currentUser === username ? null : username,
            infoBox: infoBox.USER_INFO,
        })
    },
    render: function () {
        var infoBoxRender
        switch (this.state.infoBox) {
            case infoBox.USER_INFO:
                infoBoxRender = (<UserInfoBox currentUser={this.state.currentUser } />)
                break;
            case infoBox.ADD_USER:
                infoBoxRender = (<AddUserBox addUserClick={this.addUser}  />)
                break;
            default:
                infoBoxRender = (<div></div>)
        }
        return (
            <div>
                <div className="dashboard">
                    <UserList 
                        userList={this.state.userList }
                        userClick={this.userClick}
                    />
                    {infoBoxRender}
                    <DashboardButtons 
                        isLoading={this.state.isLoading} 
                        loadButtonClick={this.loadData} 
                        addUserClick={this.addUser} 
                        addUserDialogue={this.state.addUserDialogue}
                    />
                </div>
                <ThreadList />
            </div>
        )
    }
})
