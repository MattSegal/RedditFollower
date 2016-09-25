using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace RedditFollower.Common.Models
{
    public class CommentMarkup
    {
        public CommentMarkup(string text)
        {
            this.text = text;
            this.type = Markup.RawText;
        }

        public CommentMarkup(Markup type)
        {
            this.type = type;
        }

        public CommentMarkup(string text, Markup type)
        {
            this.text = text;
            this.type = type;
        }

        public CommentMarkup(string text, string hyperlink, Markup type)
        {
            this.text = text;
            this.hyperlink = hyperlink;
            this.type = type;
        }

        [JsonPropertyAttribute(ItemConverterType = typeof(StringEnumConverter))]
        public Markup type;
        public string text;
        public string hyperlink;
    }

    public enum Markup
    {
        AnchorLink = 0, // [visible text](http://www.reddit.com/r/slatestarcodex)
        Italic = 1,     // *foo bar baz*
        NewLine = 2,    // \n
        RawLink = 3,    // http://www.reddit.com/r/slatestarcodex
        User = 4,       // /u/RedditFollower
        Subreddit = 5,  // /r/slatestarcodex
        Text = 6,       // processed text
        Quote = 7,      // a quote, starts with >
        RawText = 8,

    }
}
