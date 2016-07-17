// User List
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EmptyBox = React.createClass({
    displayName: "EmptyBox",

    render: function render() {
        return React.createElement("div", null);
    }
});

// User List
var UserList = React.createClass({
    displayName: "UserList",

    render: function render() {
        var userEntries = this.props.userList.map(function (user) {
            return React.createElement(UserEntry, { key: user.UserId, user: user });
        });
        return React.createElement(
            "ul",
            { className: "users" },
            userEntries
        );
    }
});

var UserEntry = React.createClass({
    displayName: "UserEntry",

    handleClick: function handleClick() {
        Observer.publish("UserEntryButtonClick", this.props.user);
    },
    render: function render() {
        var user = this.props.user;
        var className = this.props.user.isSuccess ? "user" : "user-failure";
        return React.createElement(
            "li",
            { className: className, onClick: this.handleClick },
            user.Username
        );
    }
});

// User Info Box
var UserInfoBox = React.createClass({
    displayName: "UserInfoBox",

    render: function render() {
        var user = this.props.user;
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
            return "Load Failed - HTTP Error Code is " + user.HttpCode;
        }
    }
});

// Thread List
var ThreadList = React.createClass({
    displayName: "ThreadList",

    render: function render() {
        var threads = this.props.threadList.sort(function (a, b) {
            return a.CreatedUtc - b.CreatedUtc;
        }).map(function (thread) {
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

    render: function render() {
        return React.createElement(
            "div",
            { className: "user-info-box" },
            React.createElement("input", { id: "new-user-name", type: "text", placeholder: "Enter username here." }),
            React.createElement(DashboardButton, { id: "add-user-button", content: "Add User", style: {}, eventName: "AddUserButtonClick" }),
            React.createElement(DashboardButton, { id: "cancel-add-user-button", content: "Cancel", style: {}, eventName: "CancelAddUserButtonClick" })
        );
    }
});

var DashboardButtons = React.createClass({
    displayName: "DashboardButtons",

    render: function render() {
        var loadButtonText = this.props.loadButtonText;
        var addUserButtonStyle = this.props.showAddUser ? {} : { display: "none" };
        return React.createElement(
            "div",
            null,
            React.createElement(DashboardButton, { id: "load-button", content: loadButtonText, eventName: "LoadButtonClick" }),
            React.createElement(DashboardButton, { id: "add-user-button", content: "Add User", style: addUserButtonStyle, eventName: "AddUserButtonClick" })
        );
    }
});

var DashboardButton = (function (_React$Component) {
    _inherits(DashboardButton, _React$Component);

    function DashboardButton() {
        _classCallCheck(this, DashboardButton);

        _get(Object.getPrototypeOf(DashboardButton.prototype), "constructor", this).call(this);
        this.handleClick = this.handleClick.bind(this);
    }

    _createClass(DashboardButton, [{
        key: "handleClick",
        value: function handleClick() {
            Observer.publish(this.props.eventName);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { onClick: this.handleClick, className: "btn", style: this.props.style },
                this.props.content
            );
        }
    }]);

    return DashboardButton;
})(React.Component);

