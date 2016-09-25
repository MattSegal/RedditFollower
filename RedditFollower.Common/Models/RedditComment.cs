using System.Collections.Generic;
using System.Linq;

namespace RedditFollower.Common.Models
{
    public class RedditComment
    {
        public RedditComment() { }
        public RedditComment(RedditApiComment apiComment)
        {
            Body = apiComment.body;
            RedditId = apiComment.id;
            RedditLinkId = apiComment.link_id;
            Author = apiComment.author;
            Score = apiComment.score;
            Downvotes = apiComment.downs;
            CreatedUtc = apiComment.created_utc;
        }
        public string Body;
        public string RedditId;
        public string RedditLinkId;
        public string Author;
        public int Score;
        public int Downvotes;
        public long CreatedUtc;
    }
}
