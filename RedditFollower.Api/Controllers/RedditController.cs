using System.Web;
using System.Web.Mvc;
using System.Linq;
using System.Collections.Generic;

using RedditFollower.Common.Models;
using RedditFollower.Common.Logging;

using RedditFollower.Api.Data;

namespace RedditFollower.Api.Controllers
{
    public class RedditController : Controller
    {
        private readonly ILogger _logger;

        public RedditController(ILogger logger)
        {
            _logger = logger;
        }

        [HttpPost] // POST: api/reddit/threads
        public JsonResult Threads(List<string> userNames)
        {
            // Get a list of comments from all users.
            var redditRepo = new RedditRepository();
            List<RedditComment> comments = new List<RedditComment>();
            List<RedditUser> users = new List<RedditUser>();
            int userId = 0; // comes from db
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
                        UserId = userId++,
                        HttpCode = errorCode,
                        Username = user,
                    });
                }
            }

            // Get Reddit threads from users' comments.
            Dictionary<string, List<RedditComment>> commentsGroupedByThread = comments
                .GroupBy(c => c.RedditLinkId)
                .ToDictionary(
                    grouping => grouping.Key, 
                    grouping => grouping.ToList()
                );

           var threadIds = comments
                .Select(c => c.RedditLinkId)
                .Distinct();

            var threads = redditRepo.GetThreadsById(threadIds);

            foreach (var thread in threads)
            {
                var threadComments = commentsGroupedByThread[RedditTypes.Thread + thread.RedditThreadId];
                thread.SetComments(threadComments);
            }

            // Make sure they're in descending order
            threads = threads
                .OrderByDescending(t => t.CreatedUtc)
                .ToList();

            var response = new ThreadResponse()
            {
                users = users,
                threads = threads
            };

            return Json(response);
        }
    }
}