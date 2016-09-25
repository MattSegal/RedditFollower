// Thread List
"use strict";

var ThreadList = React.createClass({
    displayName: "ThreadList",

    render: function render() {
        var unfilteredUsernames = UserModel.getUsers(this.props.userList).filter(function (user) {
            return user.State != UserState.FILTERED;
        }).map(function (user) {
            return user.Username;
        });
        var threadList = ThreadModel.getThreads(unfilteredUsernames);
        var threads = threadList.sort(function (a, b) {
            return b.lastCommentTime() - a.lastCommentTime();
        }).map(function (thread) {
            return React.createElement(ThreadEntry, { key: thread.RedditThreadId, thread: thread });
        });
        return React.createElement(
            "ul",
            { className: "thread-list" },
            threads
        );
    }
});

var ThreadEntry = React.createClass({
    displayName: "ThreadEntry",

    getInitialState: function getInitialState() {
        return {
            currentUser: null
        };
    },
    userClick: function userClick(username) {
        this.setState({
            currentUser: this.state.currentUser === username ? null : username
        });
    },
    render: function render() {
        var _this = this;

        var thread = this.props.thread;
        var comments = thread.Comments.filter(function (comment) {
            return comment.Author === _this.state.currentUser;
        }).map(function (comment) {
            return React.createElement(ThreadComment, { key: comment.CrearedUtc, comment: comment });
        });
        var commentList = comments.length > 0 ? commentList = React.createElement(
            "div",
            { className: "comment-list" },
            comments
        ) : null;
        var subredditLink = "http://www.reddit.com/r/" + thread.Subreddit;
        var authors = thread.CommentAuthors.map(function (author) {
            return React.createElement(ThreadAuthor, { key: author, onClick: _this.userClick, authorName: author });
        });
        return React.createElement(
            "li",
            { className: "thread" },
            React.createElement(
                "div",
                { className: "left-side" },
                React.createElement(
                    "a",
                    { href: thread.Url },
                    thread.Title
                ),
                React.createElement(
                    "div",
                    { className: "authors" },
                    authors
                ),
                commentList
            ),
            React.createElement(
                "div",
                { className: "right-side" },
                React.createElement(
                    "div",
                    { className: "subreddit" },
                    React.createElement(
                        "a",
                        { href: subredditLink },
                        thread.Subreddit
                    )
                )
            )
        );
    }
});

var paras;
var text;

var ThreadComment = React.createClass({
    displayName: "ThreadComment",

    render: function render() {
        var linkRe = new RegExp(/(\[[\s\S]+?\]\([^\)]+\))/g);
        var italicRe = new RegExp(/(_[^_]+_)/g);
        var newlineRe = new RegExp(/\n/g);
        var httpRe = new RegExp(/(http:|https:)\/\/[\s\S]+?\.[\s\S]+?(\s|$)/g);
        var userRe = new RegExp(/\/u\/\w+/g);
        var subRe = new RegExp(/\/r\/\w+/g);

        var splitRe = new RegExp(linkRe.source + "|" + italicRe.source + "|" + newlineRe.source);

        var isNewLine = function isNewLine(text) {
            return text === "";
        };
        var isQuote = function isQuote(text) {
            return text[0] === ">";
        };
        var decodeText = function decodeText(paragraph) {
            return decodeEntities(paragraph);
        };
        var removeEnds = function removeEnds(str) {
            return str.slice(1, str.length - 1);
        };

        var comment = this.props.comment;
        var textArr = (comment.Body + "\n").split(splitRe).filter(function (x) {
            return x != undefined;
        }).map(decodeText);

        var paragraphs = [];
        var paragraph = [];
        for (var i = 0; i < textArr.length; i++) {
            console.warn(textArr[i]);
            if (isNewLine(textArr[i]) && paragraph.length > 0) {
                if (typeof paragraph[0] === "string" && isQuote(paragraph[0])) {
                    paragraph[0] = paragraph[0].slice(1);
                    paragraphs.push(React.createElement(
                        "p",
                        { className: "quote" },
                        paragraph
                    ));
                } else {
                    paragraphs.push(React.createElement(
                        "p",
                        null,
                        paragraph
                    ));
                }
                paragraph = [];
            } else {
                if (isQuote(textArr[i])) {
                    paragraph.push(textArr[i]);
                    // Italics are hard because of usernames - test for usernames, subreddits, links etc 1st
                    // } else if (italicRe.test(textArr[i])) {
                    //    paragraph.push(<span className="italic">{removeEnds(textArr[i])}</span>)
                } else if (linkRe.test(textArr[i])) {
                        var link = textArr[i].split("](");
                        link[0] = link[0].slice(1);
                        link[1] = link[1].slice(0, link[1].length - 1);
                        paragraph.push(React.createElement(
                            "a",
                            { href: link[1] },
                            link[0]
                        ));
                    } else {
                        paragraph.push(React.createElement(
                            "span",
                            null,
                            textArr[i]
                        ));
                    }
            }
        }
        return React.createElement(
            "div",
            { className: "comment" },
            paragraphs
        );
    }
});

var ThreadAuthor = React.createClass({
    displayName: "ThreadAuthor",

    render: function render() {
        return React.createElement(
            "span",
            { onClick: this.props.onClick.bind(null, this.props.authorName) },
            this.props.authorName
        );
    }
});

