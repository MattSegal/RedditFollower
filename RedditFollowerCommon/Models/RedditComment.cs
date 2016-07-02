namespace RedditFollowerCommon.Models
{
    public class RedditComment
    {
        // there is probably some property based wizardry I can do to get nice names
        public string body { get; set; } // remove the URL encoding when set  (someday...)
        public string id;
        public string link_id;
        public string author;
        public int score;
        public int downs;
        public long created_utc; // it would be nice to datetime this (unix epoch time)
    }
}