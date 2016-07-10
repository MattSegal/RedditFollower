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
        var text = LoadingButtonModel.displayText
        ReactDOM.render( // it would be cool to animate this
            <LoadButton content={text } />,
            document.getElementById("load-button-root")
        )
    },
    onAddUserModelUpdate: function () {
        ReactDOM.render(
            <AddUserButton />,
            document.getElementById("add-user-button-root")
        )
    },
    onUserInfoModelUpdate: function () {
        var username = UserInfoModel.currentUser
        var user = UserModel.userExists(username) ? UserModel.getUser(username) : null
        ReactDOM.render(
            <UserInfoBox user={user } />,
            document.getElementById("user-info-box-root")
        )
    }
}