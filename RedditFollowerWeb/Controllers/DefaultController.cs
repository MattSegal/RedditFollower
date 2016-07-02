using System.Web;
using System.Web.Mvc;
using System.Linq;
using System.Collections.Generic;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using RedditFollowerCommon.Logging;
using RedditFollowerCommon.Models;
using System.Net.Http;
using System;
using System.Text;

namespace RedditFollowerWeb.Controllers
{
    public class DefaultController : Controller
    {
        private readonly ILogger _logger;

        public DefaultController(ILogger logger)
        {
            _logger = logger;
        }

        public ActionResult Client()
        {
            return View();  
        }

        public ActionResult ReactTute()
        {
            return View();
        }

        public ActionResult Index()
        {
            // This should be input - use the query string for now.
            // currently not used
            List<string> users = new List<string>() {
                "gwern",
                //"ScottAlexander",
                //"yodatsracist",
                //"PM_ME_UR_OBSIDIAN",
                //"ozymandias271",
                //"JustALittleGravitas",
                //"Wylkus"
            };

            // make an api call to get all the things

            string responseBody;
            string requestUri = "http://localhost/redditfollowerapi/reddit/threads";
            
            using (var client = new HttpClient())
            {
                // Build request.
                var request = new HttpRequestMessage()
                {
                    RequestUri = new Uri(requestUri),
                    Method = HttpMethod.Post,
                    Content = new StringContent(JsonConvert.SerializeObject(users), Encoding.UTF8,"application/json")
                };
 
                // Get response.
                HttpResponseMessage response = client.SendAsync(request).Result;
                response.EnsureSuccessStatusCode();
                responseBody = response.Content.ReadAsStringAsync().Result;
            }
           
            // Parse response.
            List<RedditThread> redditThreads = new List<RedditThread>();

            JObject responseJson = (JObject)JsonConvert.DeserializeObject(responseBody);
            JArray threadsJson = (JArray)responseJson.GetValue("threads");
            //JArray usersJson = (JArray)responseJson.GetValue("users");

            foreach (JObject thread in threadsJson)
            {
                RedditThread redditThread = (RedditThread)thread.ToObject(typeof(RedditThread));
                redditThreads.Add(redditThread);
            }

            List<RedditUser> failedUsers = new List<RedditUser>();
            //List<RedditUser> redditUsers = new List<RedditUser>();
            //foreach (JObject user in usersJson)
            //{
            //    RedditUser redditUser = (RedditUser)user.ToObject(typeof(RedditUser));
            //    redditUsers.Add(redditUser);
            //}

            ViewBag.Threads = redditThreads;
            ViewBag.FailedUsers = failedUsers;
            return View();
        }
    }
}