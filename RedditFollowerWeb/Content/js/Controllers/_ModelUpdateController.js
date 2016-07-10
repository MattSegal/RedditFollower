"use strict";

var ModelUpdateController = {
    onUserModelUpdate: function onUserModelUpdate() {
        var userList = UserModel.toArray();
        ReactDOM.render(React.createElement(UserList, { userList: userList }), document.getElementById("user-list-root"));
    },
    onThreadModelUpdate: function onThreadModelUpdate() {
        var threadList = ThreadModel.toArray();
        ReactDOM.render(React.createElement(ThreadList, { threadList: threadList }), document.getElementById("thread-list-root"));
    },
    onLoadingModelUpdate: function onLoadingModelUpdate() {
        var text = LoadingButtonModel.displayText;
        ReactDOM.render( // it would be cool to animate this
        React.createElement(LoadButton, { content: text }), document.getElementById("load-button-root"));
    },
    onAddUserModelUpdate: function onAddUserModelUpdate() {
        ReactDOM.render(React.createElement(AddUserButton, null), document.getElementById("add-user-button-root"));
    },
    onUserInfoModelUpdate: function onUserInfoModelUpdate() {
        var username = UserInfoModel.currentUser;
        var user = UserModel.userExists(username) ? UserModel.getUser(username) : null;
        ReactDOM.render(React.createElement(UserInfoBox, { user: user }), document.getElementById("user-info-box-root"));
    }
};

