var View = React.createClass({
    
    getInitialState: function () {
        var initalUserList =  [
            "gwern",
            "yodatsracist",
            "ScottAlexander"
        ]
        UserModel.addNewUsers(initalUserList)
        return ({
            userList: initalUserList,
            currentUser: null,
            isLoading: false,
            infoBox: infoBox.CLOSED,
        })
    },
    loadData: function () {
        Logger.logVerbose('View - load data')
        this.setState({
            isLoading: true,
            infoBox: infoBox.LOADING,
            currentUser: null
        })

        FollowerApi.call(this.state.userList, this.onSuccessfulLoad,this.onFailedLoad)
    },
    onSuccessfulLoad: function (response) {
        Logger.logVerbose('View - data loaded')
       
        UserModel.updateUsers(response["users"])
        ThreadModel.updateThreads(response["threads"])

        this.setState({
            isLoading: false,
            infoBox: infoBox.CLOSED,
        })
    },
    onFailedLoad: function () { // not sure if this works
        Logger.logVerbose('View - data load failed')
        UserModel.setAllUsersToFailed()
        this.setState({
            infoBox: infoBox.CLOSED,
        })
    },
    addUser: function (username) {
        Logger.logVerbose('View - add user ' + username)
        var newUserList = this.state.userList;
        var addNewUser = this.state.infoBox === infoBox.ADD_USER && username && !username.isEmpty() && !newUserList.contains(username)

       
        if (addNewUser) {
            if (UserModel.userExists(username)) {
                var user = UserModel.getUser(username)
            } else {
                UserModel.addNewUser(username)
            }
            newUserList = newUserList.concat(username)
        }

        this.setState({
            userList: newUserList,
            infoBox: this.state.infoBox === infoBox.ADD_USER ? infoBox.CLOSED : infoBox.ADD_USER,
            currentUser: null
        })
    },
    removeUser: function (username) {
        Logger.logVerbose('View - remove user '+username)
        this.setState({
            userList: this.state.userList.remove(username),
            infoBox: infoBox.CLOSED,
            currentUser: null
        })
    },
    filterUser: function (username) {
        Logger.logVerbose('View - filter user ' + username)
        var user = UserModel.getUser(username)
        user.State = UserState.FILTERED
        UserModel.updateUser(user)
        this.setState({
            infoBox: infoBox.CLOSED,
            currentUser: null
        })
    },
    unfilterUser: function (username) {
        Logger.logVerbose('View - unfilter user ' + username)
        var user = UserModel.getUser(username)
        user.State = UserState.LOADED
        UserModel.updateUser(user)
        this.setState({
            infoBox: infoBox.CLOSED,
            currentUser: null
        })
    },
    userClick: function (username) {
        Logger.logVerbose('View - user click ' + username)
        if (this.state.buttonsLocked) { return }
        this.setState({
            currentUser: this.state.currentUser === username ? null : username,
            infoBox: infoBox.USER_INFO,
        })
    },
    render: function () {
        Logger.logVerbose('View - render')
        var infoBoxRender
        switch (this.state.infoBox) {
            case infoBox.USER_INFO:
                infoBoxRender = (<UserInfoBox 
                    currentUser={this.state.currentUser }
                    filterUser={this.filterUser}
                    unfilterUser={this.unfilterUser}
                    removeUser={this.removeUser}/>)
                break;
            case infoBox.ADD_USER:
                infoBoxRender = (<AddUserBox addUserClick={this.addUser}  />)
                break;
            default:
                infoBoxRender = (<div className="info-box hidden"></div>)
        }
        return (
            <div>
                <div className="dash-panel">
                    <div className="dash-board">
                        <DashboardButtons isLoading={this.state.isLoading}
                                          loadButtonClick={this.loadData}
                                          addUserClick={this.addUser}
                                          infoBox={this.state.infoBox} />
                        <UserList userList={this.state.userList }
                                  userClick={this.userClick} />
                    </div>
                    {infoBoxRender}
                </div>
                <ThreadList userList={this.state.userList} />
            </div>
        )
    }
})

//Logger.setLogLevel("VERBOSE")
Logger.setLogLevel("SILENT")


// Initial render.
ReactDOM.render(React.createElement(View, null), document.getElementById("app-root"));