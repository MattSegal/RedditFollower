"use strict";

var UserList = React.createClass({
    displayName: "UserList",

    render: function render() {
        var _this = this;

        var userEntries = this.props.userList.map(function (username) {
            return UserModel.getUser(username);
        }).map(function (user) {
            return React.createElement(User, { handleClick: _this.props.userClick, key: user.UserId, user: user });
        });
        return React.createElement(
            "ul",
            { className: "users" },
            userEntries
        );
    }
});

var User = React.createClass({
    displayName: "User",

    render: function render() {
        var user = this.props.user;
        var className = this.props.user.isSuccess ? "user" : "user-failure";
        return React.createElement(
            "li",
            { className: className, onClick: this.props.handleClick.bind(null, user.Username) },
            user.Username
        );
    }
});

var UserInfoBox = React.createClass({
    displayName: "UserInfoBox",

    render: function render() {
        var currentUser = this.props.currentUser;
        var user = UserModel.userExists(currentUser) ? UserModel.getUser(currentUser) : null;
        if (user == null) {
            return React.createElement("div", null);
        }
        var removeUserStyle = { margin: "5px" };
        var status = this.getUserStatus(user.HttpCode);
        return React.createElement(
            "ul",
            { className: "user-info-box" },
            React.createElement(
                "li",
                { className: "user-info" },
                React.createElement(
                    "span",
                    null,
                    "User Id:"
                ),
                user.UserId
            ),
            React.createElement(
                "li",
                { className: "user-info" },
                React.createElement(
                    "span",
                    null,
                    "Username:"
                ),
                user.Username
            ),
            React.createElement(
                "li",
                { className: "user-info" },
                React.createElement(
                    "span",
                    null,
                    "Load Status:"
                ),
                status
            ),
            React.createElement(DashboardButton, { id: "remove-user-button", content: "Remove User", eventName: "RemoveUserClick", style: removeUserStyle })
        );
    },
    getUserStatus: function getUserStatus(httpCode) {
        if (httpCode == null) {
            return "Not yet loaded";
        } else if (httpCode == 200) {
            return "Loaded";
        } else {
            return "Load Failed - HTTP Error Code is " + httpCode;
        }
    }
});

// Thread List
var ThreadList = React.createClass({
    displayName: "ThreadList",

    render: function render() {
        var threadList = ThreadModel.toArray();
        var threads = threadList.sort(function (a, b) {
            return a.CreatedUtc - b.CreatedUtc;
        }) // dont sort by thread, sort by last comment
        .map(function (thread) {
            return React.createElement(ThreadEntry, { key: thread.RedditThreadId, thread: thread });
        });
        return React.createElement(
            "ul",
            null,
            threads
        );
    }
});

var ThreadEntry = React.createClass({
    displayName: "ThreadEntry",

    render: function render() {
        var thread = this.props.thread;
        var subredditLink = "http://www.reddit.com/r/" + thread.Subreddit;
        var authors = thread.CommentAuthors.map(function (author) {
            return React.createElement(ThreadAuthor, { key: author, authorName: author });
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
                )
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

var ThreadAuthor = React.createClass({
    displayName: "ThreadAuthor",

    render: function render() {
        return React.createElement(
            "span",
            null,
            this.props.authorName
        );
    }
});

var AddUserBox = React.createClass({
    displayName: "AddUserBox",

    addUser: function addUser() {
        // get a username
        var username = "foo";
        this.props.addUserClick(username);
    },
    cancelAddUser: function cancelAddUser() {
        this.props.addUserClick(null);
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "user-info-box" },
            React.createElement("input", { id: "new-user-name", type: "text", placeholder: "Enter username here." }),
            React.createElement(DashboardButton, { id: "add-user-button", content: "Add User", style: {}, handleClick: this.addUser }),
            React.createElement(DashboardButton, { id: "cancel-add-user-button", content: "Cancel", style: {}, handleClick: this.cancelAddUser })
        );
    }
});

var DashboardButtons = React.createClass({
    displayName: "DashboardButtons",

    render: function render() {
        var loadButtonText = this.props.isLoading ? "Loading links..." : "Load user links";
        var addUserButtonStyle = this.props.addUserDialogue ? { display: "none" } : {};
        return React.createElement(
            "div",
            null,
            React.createElement(DashboardButton, { id: "load-button", content: loadButtonText, handleClick: this.props.loadButtonClick }),
            React.createElement(DashboardButton, { id: "add-user-button", content: "Add User", style: addUserButtonStyle, handleClick: this.props.addUserClick })
        );
    }
});

var DashboardButton = React.createClass({
    displayName: "DashboardButton",

    render: function render() {
        return React.createElement(
            "div",
            { onClick: this.props.handleClick, className: "btn", style: this.props.style },
            this.props.content
        );
    }
});

var infoBox = {
    CLOSED: 0,
    ADD_USER: 1,
    USER_INFO: 2
};

var View = React.createClass({
    displayName: "View",

    getInitialState: function getInitialState() {
        return {
            userList: ["The_Amp_Walrus", "yodatsracist", "ScottAlexander"],
            currentUser: null,
            isLoading: false,
            infoBox: infoBox.CLOSED
        };
    },
    loadData: function loadData() {
        this.setState({
            isLoading: true,
            infoBox: infoBox.CLOSED,
            currentUser: null
        });
        setTimeout(this.onDataLoad, 1000);
    },
    onDataLoad: function onDataLoad() {
        this.setState({ isLoading: false });
    },
    addUser: function addUser(username) {
        if (this.state.buttonsLocked) {
            return;
        }
        if (this.state.infoBox === infoBox.ADD_USER && username) {
            console.log(username);
        }
        this.setState({
            infoBox: this.state.infoBox === infoBox.ADD_USER ? infoBox.CLOSED : infoBox.ADD_USER,
            currentUser: null
        });
    },
    userClick: function userClick(username) {
        if (this.state.buttonsLocked) {
            return;
        }
        this.setState({
            currentUser: this.state.currentUser === username ? null : username,
            infoBox: infoBox.USER_INFO
        });
    },
    render: function render() {
        var infoBoxRender;
        switch (this.state.infoBox) {
            case infoBox.USER_INFO:
                infoBoxRender = React.createElement(UserInfoBox, { currentUser: this.state.currentUser });
                break;
            case infoBox.ADD_USER:
                infoBoxRender = React.createElement(AddUserBox, { addUserClick: this.addUser });
                break;
            default:
                infoBoxRender = React.createElement("div", null);
        }
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "dashboard" },
                React.createElement(UserList, {
                    userList: this.state.userList,
                    userClick: this.userClick
                }),
                infoBoxRender,
                React.createElement(DashboardButtons, {
                    isLoading: this.state.isLoading,
                    loadButtonClick: this.loadData,
                    addUserClick: this.addUser,
                    addUserDialogue: this.state.addUserDialogue
                })
            ),
            React.createElement(ThreadList, null)
        );
    }
});

