using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Linq;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using RedditFollower.Common.Models;

using RedditFollower.Api.Authentication;
using System.Threading.Tasks;

namespace RedditFollower.Api.Data
{
    public class RedditRepository
    {
        public readonly string _baseUri;
        public readonly HttpClient _httpClient;

        public RedditRepository()
        { 
            _httpClient = new HttpClient();
            _baseUri = "https://oauth.reddit.com/";
        }

        public async Task<IEnumerable<RedditComment>> GetCommentsAsync(List<string> usernames)
        {
            var comments = new List<RedditComment>();
            var getCommentTasks = usernames
                .Select(username => GetUserCommentsAsync(username))
                .ToList();

            while (getCommentTasks.Count > 0)
            {
                Task<string> finishedTask = await Task.WhenAny(getCommentTasks);
                getCommentTasks.Remove(finishedTask);

                // Parse response
                var responseBody = finishedTask.Result;
                JObject responseJson = (JObject)JsonConvert.DeserializeObject(responseBody);

                foreach (JObject post in responseJson["data"]["children"])
                {
                    JObject postData = (JObject)post["data"];
                    RedditApiComment postCommentFromApi = (RedditApiComment)postData.ToObject(typeof(RedditApiComment));
                    RedditComment postComment = new RedditComment(postCommentFromApi);
                    comments.Add(postComment);
                }
            }
            return comments;
        }

        private async Task<string> GetUserCommentsAsync(string username)
        {
            // Build request.
            int limit = 25; // Currently only gets last 25 comments - up to 100 possible
            string requestUri = $"{_baseUri}user/{username}/comments?limit={limit}";

            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri(requestUri),
                Method = HttpMethod.Get,
            };
            await SetRequestAuth(request);

            // Get response.
            HttpResponseMessage response = await _httpClient.SendAsync(request).ConfigureAwait(false);

            // Parse response.
            var responseBody = await response.Content.ReadAsStringAsync();
            return responseBody;
        }

        public IEnumerable<RedditThread> GetThreadsById(IEnumerable<string> threadIds)
        {
            // Build request.
            int limit = 100;
            string names = String.Join<string>(",", threadIds);
            string getThreadsUri = $"{_baseUri}by_id/{names}?limit={limit}";
            
            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri(getThreadsUri),
                Method = HttpMethod.Get,
            };
            SetRequestAuth(request).Wait();

            // Get response.
            HttpResponseMessage response = _httpClient.SendAsync(request).Result;
            response.EnsureSuccessStatusCode();
            var responseBody = response.Content.ReadAsStringAsync().Result;

            // Parse response.
            JObject responseJson = (JObject)JsonConvert.DeserializeObject(responseBody);

            foreach (JObject thread in responseJson["data"]["children"])
            {
                JObject threadData = (JObject)thread["data"];
                RedditApiThread redditThreadFromApi = (RedditApiThread)threadData.ToObject(typeof(RedditApiThread));
                RedditThread redditThread = new RedditThread(redditThreadFromApi);
                yield return redditThread;
            }
        }

        private async Task SetRequestAuth(HttpRequestMessage request)
        {
            string authToken = await AuthRepository.GetAuthToken();
            request.Headers.Authorization = AuthenticationHeaderValue.Parse($"bearer {authToken}");
            request.Headers.Add("User-Agent", "Reddit-Bot");
        }
    }
}