//var testResponse = getTestResponse()
//var userData = testResponse["users"]

// User List

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var userList = [{ id: 1, Name: "Harry" }, { id: 2, Name: "Dick" }, { id: 3, Name: "Tom" }];

var UserList = React.createClass({
    displayName: "UserList",

    render: function render() {
        var userEntries = this.props.userList.map(function (user) {
            return React.createElement(UserEntry, { key: user.id, user: user });
        });
        return React.createElement(
            "ul",
            { className: "users" },
            userEntries
        );
    }
});

var UserEntry = React.createClass({
    displayName: "UserEntry",

    render: function render() {
        var user = this.props.user;
        return React.createElement(
            "li",
            { className: "user" },
            user.Name
        );
    }
});

ReactDOM.render(React.createElement(UserList, { userList: userList }), document.getElementById("user-list-root"));

// Toggle Button

var ToggleButton = (function (_React$Component) {
    _inherits(ToggleButton, _React$Component);

    function ToggleButton() {
        _classCallCheck(this, ToggleButton);

        _get(Object.getPrototypeOf(ToggleButton.prototype), "constructor", this).call(this);
        this.state = {
            toggle: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    _createClass(ToggleButton, [{
        key: "handleClick",
        value: function handleClick() {
            this.setState({ toggle: !this.state.toggle });
        }
    }, {
        key: "render",
        value: function render() {
            var text = this.state.toggle ? 'on' : 'off';
            return React.createElement(
                "div",
                { onClick: this.handleClick, className: "add-user-btn" },
                "This is set to ",
                text,
                ". Click to toggle."
            );
        }
    }]);

    return ToggleButton;
})(React.Component);

ReactDOM.render(React.createElement(ToggleButton, null), document.getElementById("toggle-button-root"));

