// Thread List
var ThreadList = React.createClass({
    render: function () {
        var unfilteredUsernames = UserModel.getUsers(this.props.userList)
            .filter((user) => user.State != UserState.FILTERED)
            .map((user) => user.Username)
        var threadList = ThreadModel.getThreads(unfilteredUsernames)
        var threads = threadList
            .sort((a, b) => b.lastCommentTime() - a.lastCommentTime())
            .map((thread) => <ThreadEntry key={thread.RedditThreadId} thread={thread} />)
        return (
            <ul className="thread-list">
                {threads}
            </ul>
        )
    }
});

var ThreadEntry = React.createClass({
    getInitialState: function () {
        return ({
            currentUser: null,
        })
    },
    userClick: function (username) {
        this.setState({
            currentUser: this.state.currentUser === username ? null : username,
        })
    },
    render: function () {
        var thread = this.props.thread
        var comments = thread.Comments
            .filter((comment) => comment.Author === this.state.currentUser)
            .map((comment) => <ThreadComment key={comment.CrearedUtc} comment={comment } />) 
        var commentList = comments.length > 0 ? commentList = <div className="comment-list">{comments}</div> : null
        var subredditLink = "http://www.reddit.com/r/" + thread.Subreddit
        var authors = thread.CommentAuthors
            .map((author) => <ThreadAuthor key={author} onClick={this.userClick} authorName={author } />)
        return (
            <li className="thread">
                <div className="left-side">
                    <a href={thread.Url}>{thread.Title}</a>
                    <div className="authors">
                        {authors}
                    </div>
                    {commentList}
                </div>
                <div className="right-side">
                    <div className="subreddit">
                        <a href={subredditLink}>
                            {thread.Subreddit}
                        </a>
                    </div>
                </div>
            </li>
        )
    }
});

var paras;
var text;

var ThreadComment = React.createClass({
    render: function () {
        var linkRe          = new RegExp(/(\[[\s\S]+?\]\([^\)]+\))/g)
        var italicRe        = new RegExp(/(_[^_]+_)/g)
        var newlineRe       = new RegExp(/\n/g)
        var httpRe          = new RegExp(/(http:|https:)\/\/[\s\S]+?\.[\s\S]+?(\s|$)/g)
        var userRe          = new RegExp(/\/u\/\w+/g)
        var subRe           = new RegExp(/\/r\/\w+/g)

        var splitRe = new RegExp(linkRe.source + "|" + italicRe.source + "|" + newlineRe.source )

        var isNewLine   = (text) => text === ""
        var isQuote     = (text) => text[0] === ">"
        var decodeText = (paragraph) => decodeEntities(paragraph)
        var removeEnds = (str) =>  str.slice(1, str.length - 1)

        var comment = this.props.comment
        var textArr = (comment.Body + "\n")
            .split(splitRe)
            .filter(x=>x != undefined)
            .map(decodeText)

        var paragraphs = []
        var paragraph = []
        for (var i = 0; i < textArr.length; i++) {
            console.warn(textArr[i])
            if (isNewLine(textArr[i]) && paragraph.length > 0) {
                if (typeof (paragraph[0]) === "string" && isQuote(paragraph[0])) {
                    paragraph[0] = paragraph[0].slice(1)
                    paragraphs.push(<p className="quote">{paragraph}</p>)
                } else {
                    paragraphs.push(<p>{paragraph}</p>)
                }
                paragraph = []
            } else {
                if (isQuote(textArr[i])) {
                    paragraph.push(textArr[i])
                // Italics are hard because of usernames - test for usernames, subreddits, links etc 1st
                // } else if (italicRe.test(textArr[i])) {
                //    paragraph.push(<span className="italic">{removeEnds(textArr[i])}</span>)
                } else if (linkRe.test(textArr[i])) {
                    var link = textArr[i].split("](")
                    link[0] = link[0].slice(1)
                    link[1] = link[1].slice(0,link[1].length-1)
                    paragraph.push(<a href={link[1]}>{link[0]}</a>)
                } else {
                    paragraph.push(<span>{textArr[i]}</span>)
                }
            }
        }
        return (
            <div className="comment">{paragraphs}</div>
        )
    }
});

var ThreadAuthor = React.createClass({
    render: function () {
        return (
        <span onClick={this.props.onClick.bind(null,this.props.authorName)}>{this.props.authorName}</span>
    )
    }
});
