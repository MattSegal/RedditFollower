using System.Collections.Generic;
using System.Linq;

namespace RedditFollower.Common.Models
{
    public class RedditThread
    {
        public RedditThread() { }
        public RedditThread(RedditApiThread apiThread)
        {
            Url = "http://www.reddit.com" + apiThread.permalink;
            RedditThreadId = apiThread.id;
            IsSelfPost = apiThread.is_self;
            Subreddit = apiThread.subreddit;
            Author = apiThread.author;
            Score = apiThread.score;
            NumComments = apiThread.num_comments;
            Permalink = apiThread.permalink;
            CreatedUtc = apiThread.created_utc;
            Title = apiThread.title;

        }
        public string RedditThreadId;
        public bool IsSelfPost;
        public string Subreddit;
        public string Author;
        public int Score;
        public int NumComments;
        public string Permalink;
        public long CreatedUtc;
        public string Title;
        public string Url;
        public List<RedditComment> Comments;
        public List<string> CommentAuthors;
        public void SetComments(List<RedditComment> comments)
        {
            Comments = comments;
            CommentAuthors = (from comment in comments
                              select comment.Author).Distinct().ToList<string>();
        }
        
    }
}
