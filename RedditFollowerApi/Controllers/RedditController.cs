using System.Web;
using System.Web.Mvc;
using System.Linq;
using System.Collections.Generic;

using RedditFollowerCommon.Models;
using RedditFollowerCommon.Logging;

using RedditFollowerApi.Data;

namespace RedditFollowerApi.Controllers
{
    public class RedditController : Controller
    {
        private readonly ILogger _logger;

        public RedditController(ILogger logger)
        {
            _logger = logger;
        }

        [HttpPost] // POST: api/reddit/threads
        //public JsonResult Threads(string usersJson) // can we take a model as param?
        public JsonResult Threads(List<string> userNames)
        {
            // Get a list of comments from all users.
            var redditRepo = new RedditRepository();
            List<RedditComment> comments = new List<RedditComment>();
            List<RedditUser> users = new List<RedditUser>();
            foreach (string user in userNames)
            {
                // Can rework this to get more or fewer comments later
                _logger.Log($"Getting comments for {user}");
                int errorCode = 200;
                try
                {
                    List<RedditComment> userComments = redditRepo.GetRecentUserComments(user);
                    comments.AddRange(userComments);
                }
                catch (HttpException ex)
                {
                    errorCode = ex.GetHttpCode();
                    _logger.Log(ex.Message + $" status code {errorCode}");
                }
                finally
                {
                    users.Add(new RedditUser
                    {
                        HttpCode = errorCode,
                        Username = user,
                        isSuccess = errorCode == 200
                    });
                }
            }

            // Get Reddit threads from users' comments.
            // Warning O(n^9000)
            Dictionary<string, List<RedditComment>> commentsGroupedByThread =
                (from comment in comments
                 group comment by comment.link_id into commentGroup
                 select commentGroup).ToDictionary(grouping => grouping.Key, grouping => grouping.ToList());

            IEnumerable<string> threadIds =
                (from comment in comments
                 select comment.link_id).Distinct<string>();

            List<RedditThread> threads = redditRepo.GetThreadsById(threadIds);

            foreach (RedditThread thread in threads)
            {
                thread.comments = commentsGroupedByThread[RedditTypes.Thread + thread.id];
            }

            // Make sure they're in descending order
            threads =
                (from thread in threads
                 orderby thread.created_utc descending
                 select thread).ToList<RedditThread>();

            var response = new ThreadResponse()
            {
                users = users,
                threads = threads
            };

            return Json(response);
        }
    }
}