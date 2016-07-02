using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using RedditFollowerCommon.Models;

using RedditFollowerApi.Authentication;

namespace RedditFollowerApi.Data
{
    public class RedditRepository
    {
        public string _baseUri = "https://oauth.reddit.com/";
        // Currently only gets last 25 comments
        // It would be nice to get as many as we like

        public bool VerifyRedditUsername(string username)
        {
            return false;
        }

        public List<RedditComment> GetRecentUserComments(string username)
        {
            string getUserCommentsUri = _baseUri+$"user/{username}/comments";
            string authToken = AuthRepository.GetAuthToken();
            string responseBody;
            using (var client = new HttpClient())
            {
                // Build query string into URI.
                var builder = new UriBuilder(getUserCommentsUri);
                var query = HttpUtility.ParseQueryString(string.Empty);
                query["limit"] = "25";
                builder.Query = query.ToString();
                
                // Build request.
                var request = new HttpRequestMessage()
                {
                    RequestUri = new Uri(builder.ToString()),
                    Method = HttpMethod.Get,
                };
                request.Headers.Authorization = AuthenticationHeaderValue.Parse($"bearer {authToken}");
                request.Headers.Add("User-Agent", "Reddit-Bot");

                // Get response.
                HttpResponseMessage response = client.SendAsync(request).Result;
                if (!response.IsSuccessStatusCode)
                    throw new HttpException((int)response.StatusCode,$"Could not retrieve comments for {username}");
    
                responseBody = response.Content.ReadAsStringAsync().Result;
            }

            // Parse response.
            List<RedditComment> redditComments = new List<RedditComment>();
            JObject responseJson = (JObject)JsonConvert.DeserializeObject(responseBody);

            foreach (JObject post in responseJson["data"]["children"])
            {
                JObject postData = (JObject)post["data"];
                RedditComment postComment = (RedditComment)postData.ToObject(typeof(RedditComment));
                redditComments.Add(postComment);
            }
            return redditComments;
        }

        public List<RedditThread> GetThreadsById(IEnumerable<string> threadIds)
        {
            string names = String.Join<string>(",", threadIds);
            string getThreadsUri = _baseUri + $"by_id/{names}?limit=100";

            string authToken = AuthRepository.GetAuthToken();
            string responseBody;
            using (var client = new HttpClient())
            {
                // Build request.
                var request = new HttpRequestMessage()
                {
                    RequestUri = new Uri(getThreadsUri),
                    Method = HttpMethod.Get,
                };
                request.Headers.Authorization = AuthenticationHeaderValue.Parse($"bearer {authToken}");
                request.Headers.Add("User-Agent", "Reddit-Bot");

                // Get response.
                HttpResponseMessage response = client.SendAsync(request).Result;
                response.EnsureSuccessStatusCode();
                responseBody = response.Content.ReadAsStringAsync().Result;
            }

            // Parse response.
            List<RedditThread> redditThreads = new List<RedditThread>();
            JObject responseJson = (JObject)JsonConvert.DeserializeObject(responseBody);

            foreach (JObject thread in responseJson["data"]["children"])
            {
                JObject threadData = (JObject)thread["data"];
                RedditThread redditThread = (RedditThread)threadData.ToObject(typeof(RedditThread));
                redditThreads.Add(redditThread);
            }

            return redditThreads;
        }
    }
}