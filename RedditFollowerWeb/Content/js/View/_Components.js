"use strict";

var View = React.createClass({
    displayName: "View",

    getInitialState: function getInitialState() {
        var initalUserList = ["gwern", "yodatsracist", "ScottAlexander"];
        UserModel.addNewUsers(initalUserList);
        return {
            userList: initalUserList,
            currentUser: null,
            isLoading: false,
            infoBox: infoBox.CLOSED
        };
    },
    loadData: function loadData() {
        Logger.logVerbose('View - load data');
        this.setState({
            isLoading: true,
            infoBox: infoBox.LOADING,
            currentUser: null
        });

        FollowerApi.call(this.state.userList, this.onSuccessfulLoad, this.onFailedLoad);
    },
    onSuccessfulLoad: function onSuccessfulLoad(response) {
        Logger.logVerbose('View - data loaded');

        UserModel.updateUsers(response["users"]);
        ThreadModel.updateThreads(response["threads"]);

        this.setState({
            isLoading: false,
            infoBox: infoBox.CLOSED
        });
    },
    onFailedLoad: function onFailedLoad() {
        // not sure if this works
        Logger.logVerbose('View - data load failed');
        UserModel.setAllUsersToFailed();
        this.setState({
            infoBox: infoBox.CLOSED
        });
    },
    addUser: function addUser(username) {
        Logger.logVerbose('View - add user ' + username);
        var newUserList = this.state.userList;
        var addNewUser = this.state.infoBox === infoBox.ADD_USER && username && !username.isEmpty() && !newUserList.contains(username);

        if (addNewUser) {
            if (UserModel.userExists(username)) {
                var user = UserModel.getUser(username);
            } else {
                UserModel.addNewUser(username);
            }
            newUserList = newUserList.concat(username);
        }

        this.setState({
            userList: newUserList,
            infoBox: this.state.infoBox === infoBox.ADD_USER ? infoBox.CLOSED : infoBox.ADD_USER,
            currentUser: null
        });
    },
    removeUser: function removeUser(username) {
        Logger.logVerbose('View - remove user ' + username);
        this.setState({
            userList: this.state.userList.remove(username),
            infoBox: infoBox.CLOSED,
            currentUser: null
        });
    },
    filterUser: function filterUser(username) {
        Logger.logVerbose('View - filter user ' + username);
        var user = UserModel.getUser(username);
        user.State = UserState.FILTERED;
        UserModel.updateUser(user);
        this.setState({
            infoBox: infoBox.CLOSED,
            currentUser: null
        });
    },
    unfilterUser: function unfilterUser(username) {
        Logger.logVerbose('View - unfilter user ' + username);
        var user = UserModel.getUser(username);
        user.State = UserState.LOADED;
        UserModel.updateUser(user);
        this.setState({
            infoBox: infoBox.CLOSED,
            currentUser: null
        });
    },
    userClick: function userClick(username) {
        Logger.logVerbose('View - user click ' + username);
        if (this.state.buttonsLocked) {
            return;
        }
        this.setState({
            currentUser: this.state.currentUser === username ? null : username,
            infoBox: infoBox.USER_INFO
        });
    },
    render: function render() {
        Logger.logVerbose('View - render');
        var infoBoxRender;
        switch (this.state.infoBox) {
            case infoBox.USER_INFO:
                infoBoxRender = React.createElement(UserInfoBox, {
                    currentUser: this.state.currentUser,
                    filterUser: this.filterUser,
                    unfilterUser: this.unfilterUser,
                    removeUser: this.removeUser });
                break;
            case infoBox.ADD_USER:
                infoBoxRender = React.createElement(AddUserBox, { addUserClick: this.addUser });
                break;
            default:
                infoBoxRender = React.createElement("div", { className: "info-box hidden" });
        }
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "dash-panel" },
                React.createElement(
                    "div",
                    { className: "dash-board" },
                    React.createElement(DashboardButtons, { isLoading: this.state.isLoading,
                        loadButtonClick: this.loadData,
                        addUserClick: this.addUser,
                        infoBox: this.state.infoBox }),
                    React.createElement(UserList, { userList: this.state.userList,
                        userClick: this.userClick })
                ),
                infoBoxRender
            ),
            React.createElement(ThreadList, { userList: this.state.userList })
        );
    }
});

//Logger.setLogLevel("VERBOSE")
Logger.setLogLevel("SILENT");

// Initial render.
ReactDOM.render(React.createElement(View, null), document.getElementById("app-root"));

