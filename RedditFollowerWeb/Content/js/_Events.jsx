// Events
function loadButtonOnClick() {
    FollowerApi.call(UserModel.usernames(), updateModelsFromApi)
}

function updateModelsFromApi(response) {
    response["users"].map((user) => UserModel.updateUser(user))
    response["threads"].map((thread) => ThreadModel.updateThread(thread))
}

function onUserModelUpdate() {
    ReactDOM.render(
        <UserList userList={UserModel.toArray() } />,
        document.getElementById("user-list-root")
    )
}

function onThreadModelUpdate() {
    ReactDOM.render(
        <ThreadList threadList={ThreadModel.toArray()} />,
        document.getElementById("thread-list-root")
    )
}

// Initialise App
events = [
    "LoadButtonClick",
    "UserModelUpdate",
    "ThreadModelUpdate"
]
events.map((event) => Observer.addEvent(event))

Observer.subscribe("LoadButtonClick", loadButtonOnClick)
Observer.subscribe("UserModelUpdate", onUserModelUpdate)
Observer.subscribe("ThreadModelUpdate", onThreadModelUpdate)

ReactDOM.render(
    <LoadButton />,
    document.getElementById("load-button-root")
)
