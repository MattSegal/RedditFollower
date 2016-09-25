using System.Collections.Generic;

namespace RedditFollower.Common.Models
{
    public class ThreadResponse
    {
        public IEnumerable<RedditUser> users;
        public IEnumerable<RedditThread> threads;
    }
}
