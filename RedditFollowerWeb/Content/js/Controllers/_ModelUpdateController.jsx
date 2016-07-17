var ModelUpdateController = {
    onUserModelUpdate: function() {
        var userList = UserModel.toArray()
        ReactDOM.render(
            <UserList userList={userList } />,
            document.getElementById("user-list-root")
        )
    },
    onThreadModelUpdate: function() {
        var threadList = ThreadModel.toArray()
        ReactDOM.render(
            <ThreadList threadList={threadList} />,
            document.getElementById("thread-list-root")
        )
    },
    onLoadingModelUpdate: function () {
        ModelUpdateController._renderDashbuttons() // lame
    },
    onAddUserModelUpdate: function () {
        ModelUpdateController._renderDashbuttons() // lame
        if (AddUserButtonModel.isInDialogue) {
            ReactDOM.render(
                <AddUserBox/>,
                document.getElementById("user-info-box-root")
            )
        } else {
            ReactDOM.render(
                <EmptyBox/>,
                document.getElementById("user-info-box-root")
            )
        }
    },
    onUserInfoModelUpdate: function () {
        var username = UserInfoModel.currentUser
        var user = UserModel.userExists(username) ? UserModel.getUser(username) : null
        ReactDOM.render(
            <UserInfoBox user={user } />,
            document.getElementById("user-info-box-root")
        )
    },
    _renderDashbuttons: function () {
        var loadButtonText = LoadingButtonModel.displayText
        var showAddUser = AddUserButtonModel.isInDashbuttons
        ReactDOM.render(
            <DashboardButtons loadButtonText={loadButtonText} showAddUser={showAddUser} />,
            document.getElementById("dashbutton-root")
        )
    },
}