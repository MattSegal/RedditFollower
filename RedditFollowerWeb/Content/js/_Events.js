"use strict";

function updateModel(response) {
    // Update Users
    response["users"].map(function (user) {
        UserModel.updateUser(user["Username"], user);
    });
    userList = UserModel.toArray();
    console.log(userList); // debug
    renderUsers(userList); // plz replace me with observer pattern

    // Update Threads
}
console.log("wew lad");

function renderUsers(userList) {
    ReactDOM.render(React.createElement(UserList, { userList: userList }), document.getElementById("user-list-root"));
}

ReactDOM.render(React.createElement(LoadButton, null), document.getElementById("load-button-root"));

ReactDOM.render(React.createElement(ToggleButton, null), document.getElementById("toggle-button-root"));

