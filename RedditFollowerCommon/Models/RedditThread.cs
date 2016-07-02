using System.Collections.Generic;
using System.Linq;

namespace RedditFollowerCommon.Models
{
    // This is a 'link' in the Reddit API
    public class RedditThread
    {
        public string id; // type is t3 so link_id will be t3_+id
        public bool is_self;
        public string subreddit;
        public string author;
        public int score;
        public int num_comments;
        public string Url {
            get
            {
                return "http://www.reddit.com" + this.permalink;
            }
        }
        public string permalink;
        public long created_utc;
        public string title;
        public string url;
        public List<RedditComment> comments;

        public List<string> GetCommentAuthors()
        {
            return (from comment in comments
                    select comment.author).Distinct().ToList<string>();
        }
    }
}