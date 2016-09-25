using System.Collections.Generic;

namespace RedditFollower.Common.Models
{
    public class ThreadResponse
    {
        public List<RedditUser> users;
        public List<RedditThread> threads;
    }
}
