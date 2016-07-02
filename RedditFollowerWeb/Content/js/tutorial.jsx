//var testResponse = getTestResponse()
//var userData = testResponse["users"]

// User List

var userList = [
    { id: 1, Name: "Harry"},
    { id: 2, Name: "Dick" },
    { id: 3, Name: "Tom" }
]

var UserList = React.createClass({
    render: function () {
        var userEntries = this.props.userList.map(
            (user) => <UserEntry key={user.id} user={user}/>
        )
        return (
            <ul className="users">
                {userEntries}
            </ul>
    )}
});

var UserEntry = React.createClass({
    render: function () {
        var user = this.props.user
        return (
        <li className="user">
            {user.Name}
        </li>
    )}
});

ReactDOM.render(
    <UserList userList={userList} />,
    document.getElementById("user-list-root")
)


// Toggle Button
class ToggleButton extends React.Component {
    constructor() {
        super()
        this.state = {
            toggle: false
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        this.setState({toggle: !this.state.toggle})
    }
    render() {
        const text = this.state.toggle ? 'on' : 'off'
        return (
            <div onClick={this.handleClick} className="add-user-btn">
                This is set to {text}. Click to toggle.
            </div>
        )
    }
}

ReactDOM.render(
    <ToggleButton />,
    document.getElementById("toggle-button-root")
)