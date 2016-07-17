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
        ModelUpdateController._renderDashbuttons(); // lame
    },
    onAddUserModelUpdate: function onAddUserModelUpdate() {
        ModelUpdateController._renderDashbuttons(); // lame
        if (AddUserButtonModel.isInDialogue) {
            ReactDOM.render(React.createElement(AddUserBox, null), document.getElementById("user-info-box-root"));
        } else {
            ReactDOM.render(React.createElement(EmptyBox, null), document.getElementById("user-info-box-root"));
        }
    },
    onUserInfoModelUpdate: function onUserInfoModelUpdate() {
        var username = UserInfoModel.currentUser;
        var user = UserModel.userExists(username) ? UserModel.getUser(username) : null;
        ReactDOM.render(React.createElement(UserInfoBox, { user: user }), document.getElementById("user-info-box-root"));
    },
    _renderDashbuttons: function _renderDashbuttons() {
        var loadButtonText = LoadingButtonModel.displayText;
        var showAddUser = AddUserButtonModel.isInDashbuttons;
        ReactDOM.render(React.createElement(DashboardButtons, { loadButtonText: loadButtonText, showAddUser: showAddUser }), document.getElementById("dashbutton-root"));
    }
};

