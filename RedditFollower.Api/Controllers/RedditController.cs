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

        [HttpPost] // POST: api/reddit/threads
        public JsonResult Threads(List<string> userNames)
        {
            int userId = 0; // Pull from elsewhere if persistent data store used.

            var comments = _redditRepository.GetCommentsAsync(userNames).Result;

            // Parse markdown in comment body
            // https://github.com/hey-red/Markdown
            Markdown mark = new Markdown();
            foreach (var comment in comments)
            {
                comment.Body = mark.Transform(comment.Body);
            }

            List<RedditUser> users = new List<RedditUser>();

            var commentAuthors = comments
                .Select(c => c.Author)
                .Distinct();

            foreach (var username in userNames)
            {
                var success = commentAuthors.Contains(username);
                int errorCode = success ? 200 : 500; // this is not ideal - no distinction between 404 and 500 errors
                users.Add(new RedditUser
                {
                    UserId = userId++,
                    HttpCode = errorCode,
                    Username = username,
                });
            }

            // What if there are no comments returned?
            var threadIds = comments
                .Select(c => c.RedditLinkId)
                .Distinct();

            var threads = _redditRepository
                .GetThreadsById(threadIds)
                .OrderByDescending(t => t.CreatedUtc)
                .ToList();

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