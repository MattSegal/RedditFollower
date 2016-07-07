// Render
function renderUsers(userList) {
    ReactDOM.render(
        <UserList userList={userList } />,
        document.getElementById("user-list-root")
    )
}

function renderUserInfo(infoText) {
    ReactDOM.render(
        <UserListInfo infoText={infoText } />,
        document.getElementById("user-info-root")
    )
}

function renderThreads(threadList) {
    ReactDOM.render(
        <ThreadList threadList={threadList} />,
        document.getElementById("thread-list-root")
    )
}

function renderLoadButton(innerText) {
    ReactDOM.render(
        <LoadButton content={innerText} />,
        document.getElementById("load-button-root")
    )
}

// Events
function onLoadButtonClick() {
    FollowerApi.call(UserModel.usernames(), onSuccessfulApiResponse, onFailedApiResponse)
}

function onSuccessfulApiResponse(response) {
    UserModel.updateUsers(response["users"])
    ThreadModel.updateThreads(response["threads"])

    Observer.publish("LoadingComplete")
}

function onFailedApiResponse() {
    UserModel.setAllUsersToFailed()
    Observer.publish("LoadingComplete")
}

function onUserModelUpdate() {
    renderUsers(UserModel.toArray())
}

function onThreadModelUpdate() {
    renderThreads(ThreadModel.toArray())
}

// Initialise events.
var events = [
    "LoadButtonClick",
    "LoadingComplete",
    "UserModelUpdate",
    "ThreadModelUpdate"
]
events.map((event) => Observer.addEvent(event))

Observer.subscribe("LoadButtonClick", onLoadButtonClick)
Observer.subscribe("LoadButtonClick", () => renderLoadButton("Loading links...")) // it would be cool to animate these
Observer.subscribe("LoadButtonClick", () => renderUserInfo("Updating users..."))

Observer.subscribe("LoadingComplete", () => renderLoadButton("Load user links"))
Observer.subscribe("LoadingComplete", () => renderUserInfo(null))

Observer.subscribe("UserModelUpdate", onUserModelUpdate)
Observer.subscribe("ThreadModelUpdate", onThreadModelUpdate)

// Add default users.
UserModel.updateUsers([
    {
        UserId: 0,
        isSuccess: true,
        Username : "The_Amp_Walrus"
    },
    {
        UserId: 1,
        isSuccess: true,
        Username: "yodatsracist"
    },
    {
        UserId: 2,
        isSuccess: true,
        Username: "ScottAlexander"
    },
])

// Initial render.
renderLoadButton("Load user links")