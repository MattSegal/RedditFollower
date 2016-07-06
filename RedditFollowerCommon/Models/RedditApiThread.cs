using System.Collections.Generic;
using System.Linq;

namespace RedditFollowerCommon.Models
{
    // This is called a 'link' in the Reddit API
    public class RedditApiThread
    {
        public string id; // type is t3 so link_id will be t3_+id
        public bool is_self;
        public string subreddit;
        public string author;
        public int score;
        public int num_comments;
        public string permalink;
        public long created_utc;
        public string title;
        public string url;
    }
}