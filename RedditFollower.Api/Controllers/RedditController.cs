using System.Web;
using System.Web.Mvc;
using System.Linq;
using System.Collections.Generic;

using RedditFollower.Common.Models;
using RedditFollower.Common.Logging;

using RedditFollower.Api.Data;
using HeyRed.MarkdownSharp;

namespace RedditFollower.Api.Controllers
{
    public class RedditController : Controller
    {
        private readonly ILogger _logger;
        private readonly RedditRepository _redditRepository;

        public RedditController(ILogger logger)
        {
            _logger = logger;
            _redditRepository = new RedditRepository();
        }

        /// <summary>
        /// TODO - either batch import threads and comments
        /// or make these API calls asynchronous
        /// </summary>
        [HttpPost] // POST: api/reddit/threads
        public JsonResult Threads(List<string> userNames)
        {
            // Get a list of comments from all users.
            List<RedditComment> comments = new List<RedditComment>();
            List<RedditUser> users = new List<RedditUser>();
            int userId = 0; // Pull from elsewhere if persistent data store used.
            foreach (string user in userNames)
            {
                // Can rework this to get more or fewer comments later
                _logger.Log($"Getting comments for {user}");
                int errorCode = 200;
                try
                {
                    var userComments = _redditRepository.GetRecentUserComments(user);

                    // Parse markdown in comment body
                    // https://github.com/hey-red/Markdown
                    Markdown mark = new Markdown();
                    foreach (var comment in userComments)
                    {
                        comment.Body = mark.Transform(comment.Body);
                    }                    

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
            var threadIds = comments
                .Select(c => c.RedditLinkId)
                .Distinct();

            var threads = _redditRepository
                .GetThreadsById(threadIds)
                .OrderByDescending(t => t.CreatedUtc);

            foreach (var thread in threads)
            {
                string threadId = RedditTypes.Thread + thread.RedditThreadId;
                var threadComments = comments
                    .Where(c => c.RedditLinkId == threadId)
                    .ToList();
                thread.SetComments(threadComments);
            }
            
            var response = new ThreadResponse()
            {
                users = users,
                threads = threads
            };

            return Json(response);
        }
    }
}