// User Stuff
var UserList = React.createClass({
    render: function () {
        var userEntries = this.props.userList
            .map((username) => UserModel.getUser(username))
            .map((user) => <User handleClick={this.props.userClick} key={user.Username} user={user } />)
        return (
            <ul className="users">
                {userEntries}
            </ul>
        )
    }
});

var User = React.createClass({
    render: function () {
        var user = this.props.user
        var className
        
        var style;
        switch (user.State) {
            case UserState.NOT_LOADED:
                className = "user btn neutral"
                break;
            case UserState.LOADED:
                className = "user btn success"
                break;
            case UserState.FAILED:
                className = "user btn failure"
                break;
            case UserState.FILTERED:
                className = "user btn filtered"
                break;
        }
        return (
        <li className={className} onClick={this.props.handleClick.bind(null,user.Username)}>
            {user.Username}
        </li>
        )
    }
});