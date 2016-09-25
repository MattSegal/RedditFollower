// User Stuff
"use strict";

var UserList = React.createClass({
    displayName: "UserList",

    render: function render() {
        var _this = this;

        var userEntries = this.props.userList.map(function (username) {
            return UserModel.getUser(username);
        }).map(function (user) {
            return React.createElement(User, { handleClick: _this.props.userClick, key: user.Username, user: user });
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
        var className;

        var style;
        switch (user.State) {
            case UserState.NOT_LOADED:
                className = "user btn neutral";
                break;
            case UserState.LOADED:
                className = "user btn success";
                break;
            case UserState.FAILED:
                className = "user btn failure";
                break;
            case UserState.FILTERED:
                className = "user btn filtered";
                break;
        }
        return React.createElement(
            "li",
            { className: className, onClick: this.props.handleClick.bind(null, user.Username) },
            user.Username
        );
    }
});

