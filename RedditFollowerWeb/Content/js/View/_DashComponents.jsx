var UserInfoBox = React.createClass({
    removeUser: function (username) {
        Logger.logVerbose('UserInfoBox - removing  user ' + username)
        this.props.removeUser(username)
    },
    filterUser: function (username) {
        Logger.logVerbose('UserInfoBox - filtering  user ' + username)
        this.props.filterUser(username)
    },
    unfilterUser: function (username) {
        Logger.logVerbose('UserInfoBox - unfiltering  user ' + username)
        this.props.unfilterUser(username)
    },
    render: function () {
        var currentUser = this.props.currentUser
        var user = UserModel.userExists(currentUser) ? UserModel.getUser(currentUser) : null
        if (user == null) {
            return (<div className="info-box hidden"></div>)
        }
        var statusText = this.getUserStatusText(user)
        var filterButton;
        if (user.State === UserState.FILTERED) {
            filterButton = <DashboardButton className="success" content="Unfilter User" handleClick={this.unfilterUser.bind(null, user.Username)} />
        } else if (user.State === UserState.LOADED) {
            filterButton = <DashboardButton className="filtered" content="Filter User" handleClick={this.filterUser.bind(null,user.Username)} />
        }
        return (
            <div className="info-box info-box-user">
                <div className="user-info">{user.Username}{statusText}</div>
                <DashboardButton className="danger" content="Remove User" handleClick={this.removeUser.bind(null,user.Username)} />
               {filterButton}
            </div>
        )
    },
    getUserStatusText(user) {
        switch (user.State) {
            case UserState.NOT_LOADED:
                return "'s threads have has not been loaded yet."
            case UserState.LOADED:
                return "'s threads have been loaded."
            case UserState.FILTERED:
                return "'s threads have been filtered out."
            default:
                return "'s load has failed with error code " + user.HttpCode + "."
        }
    }
});

var AddUserBox = React.createClass({
    handleKeyPress: function(e) {
        if (e.charCode == 13) {this.addUser()}
    },
    addUser: function() {
        var userInput = ReactDOM.findDOMNode(this.refs.newUserInput)
        var username = userInput.value
        Logger.logVerbose("AddUserBox - Add user submitted: " + username)
        userInput.value = ''
        this.props.addUserClick(username)
    },
    cancelAddUser: function () {
        this.props.addUserClick(null)
    },
    render: function () {
        return (
            <div className="info-box info-box-add-user">
                <input id="new-user-input" onKeyPress={this.handleKeyPress} type="text" placeholder="Enter username here." autoFocus={true} ref="newUserInput" />
                <DashboardButton className="happy" content="Add User" style={{}} handleClick={this.addUser}/>
                <DashboardButton className="danger" content="Cancel" style={{}} handleClick={this.cancelAddUser} />
            </div>
        )
    }
})


var DashboardButtons = React.createClass({
    render: function () {
        var loadButtonText = this.props.isLoading ? "Loading links..." : "Load user links"
        var hideAddUserButton = this.props.infoBox == infoBox.ADD_USER || this.props.infoBox == infoBox.LOADING
        var addUserButtonStyle = hideAddUserButton ? { display: "none" } : {}
        return (
            <div className="dash-buttons">
                <DashboardButton content={loadButtonText} handleClick={this.props.loadButtonClick} />
                <DashboardButton content="Add User" style={addUserButtonStyle} handleClick={this.props.addUserClick} />
            </div>
        ) // consider making add user neutral color when unselectable
    }
})

var DashboardButton = React.createClass({
    render: function() {
        var className = "btn " + this.props.className
        return (
            <div id={this.props.id} onClick={this.props.handleClick} className={className} style={this.props.style}>
                {this.props.content}
            </div>
        )
    }
})
