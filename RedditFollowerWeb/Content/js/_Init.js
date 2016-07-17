// Add default users.
var defaultUsers = [
    "The_Amp_Walrus",
    "yodatsracist",
    "ScottAlexander"
]
UserModel.addNewUsers(defaultUsers)

// Initial render.
ReactDOM.render(React.createElement(View, null), document.getElementById("app-root"));