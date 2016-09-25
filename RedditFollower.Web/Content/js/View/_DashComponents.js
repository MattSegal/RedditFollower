'use strict';

var UserInfoBox = React.createClass({
    displayName: 'UserInfoBox',

    removeUser: function removeUser(username) {
        Logger.logVerbose('UserInfoBox - removing  user ' + username);
        this.props.removeUser(username);
    },
    filterUser: function filterUser(username) {
        Logger.logVerbose('UserInfoBox - filtering  user ' + username);
        this.props.filterUser(username);
    },
    unfilterUser: function unfilterUser(username) {
        Logger.logVerbose('UserInfoBox - unfiltering  user ' + username);
        this.props.unfilterUser(username);
    },
    render: function render() {
        var currentUser = this.props.currentUser;
        var user = UserModel.userExists(currentUser) ? UserModel.getUser(currentUser) : null;
        if (user == null) {
            return React.createElement('div', { className: 'info-box hidden' });
        }
        var statusText = this.getUserStatusText(user);
        var filterButton;
        if (user.State === UserState.FILTERED) {
            filterButton = React.createElement(DashboardButton, { className: 'success', content: 'Unfilter User', handleClick: this.unfilterUser.bind(null, user.Username) });
        } else if (user.State === UserState.LOADED) {
            filterButton = React.createElement(DashboardButton, { className: 'filtered', content: 'Filter User', handleClick: this.filterUser.bind(null, user.Username) });
        }
        return React.createElement(
            'div',
            { className: 'info-box info-box-user' },
            React.createElement(
                'div',
                { className: 'user-info' },
                user.Username,
                statusText
            ),
            React.createElement(DashboardButton, { className: 'danger', content: 'Remove User', handleClick: this.removeUser.bind(null, user.Username) }),
            filterButton
        );
    },
    getUserStatusText: function getUserStatusText(user) {
        switch (user.State) {
            case UserState.NOT_LOADED:
                return "'s threads have has not been loaded yet.";
            case UserState.LOADED:
                return "'s threads have been loaded.";
            case UserState.FILTERED:
                return "'s threads have been filtered out.";
            default:
                return "'s load has failed with error code " + user.HttpCode + ".";
        }
    }
});

var AddUserBox = React.createClass({
    displayName: 'AddUserBox',

    handleKeyPress: function handleKeyPress(e) {
        if (e.charCode == 13) {
            this.addUser();
        }
    },
    addUser: function addUser() {
        var userInput = ReactDOM.findDOMNode(this.refs.newUserInput);
        var username = userInput.value;
        Logger.logVerbose("AddUserBox - Add user submitted: " + username);
        userInput.value = '';
        this.props.addUserClick(username);
    },
    cancelAddUser: function cancelAddUser() {
        this.props.addUserClick(null);
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'info-box info-box-add-user' },
            React.createElement('input', { id: 'new-user-input', onKeyPress: this.handleKeyPress, type: 'text', placeholder: 'Enter username here.', autoFocus: true, ref: 'newUserInput' }),
            React.createElement(DashboardButton, { className: 'happy', content: 'Add User', style: {}, handleClick: this.addUser }),
            React.createElement(DashboardButton, { className: 'danger', content: 'Cancel', style: {}, handleClick: this.cancelAddUser })
        );
    }
});

var DashboardButtons = React.createClass({
    displayName: 'DashboardButtons',

    render: function render() {
        var loadButtonText = this.props.isLoading ? "Loading links..." : "Load user links";
        var hideAddUserButton = this.props.infoBox == infoBox.ADD_USER || this.props.infoBox == infoBox.LOADING;
        var addUserButtonStyle = hideAddUserButton ? { display: "none" } : {};
        return React.createElement(
            'div',
            { className: 'dash-buttons' },
            React.createElement(DashboardButton, { content: loadButtonText, handleClick: this.props.loadButtonClick }),
            React.createElement(DashboardButton, { content: 'Add User', style: addUserButtonStyle, handleClick: this.props.addUserClick })
        ); // consider making add user neutral color when unselectable
    }
});

var DashboardButton = React.createClass({
    displayName: 'DashboardButton',

    render: function render() {
        var className = "btn " + this.props.className;
        return React.createElement(
            'div',
            { id: this.props.id, onClick: this.props.handleClick, className: className, style: this.props.style },
            this.props.content
        );
    }
});

