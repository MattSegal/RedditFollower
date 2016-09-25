using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using RedditFollower.Common.Models;

using RedditFollower.Api.Authentication;

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

        public IEnumerable<RedditComment> GetRecentUserComments(string username)
        {
            // Build request.
            int limit = 25; // Currently only gets last 25 comments - up to 100 possible
            string requestUri = $"{_baseUri}user/{username}/comments?limit={limit}";
            
            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri(requestUri),
                Method = HttpMethod.Get,
            };
            SetRequestAuth(request);

            // Get response.
            HttpResponseMessage response = _httpClient.SendAsync(request).Result;
            if (!response.IsSuccessStatusCode)
                throw new HttpException((int)response.StatusCode,$"Could not retrieve comments for {username}");

            // Parse response.
            var responseBody = response.Content.ReadAsStringAsync().Result;
            JObject responseJson = (JObject)JsonConvert.DeserializeObject(responseBody);

            foreach (JObject post in responseJson["data"]["children"])
            {
                JObject postData = (JObject)post["data"];
                RedditApiComment postCommentFromApi = (RedditApiComment)postData.ToObject(typeof(RedditApiComment));
                RedditComment postComment = new RedditComment(postCommentFromApi);
                yield return postComment;
            }
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
            SetRequestAuth(request);

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

        private void SetRequestAuth(HttpRequestMessage request)
        {
            string authToken = AuthRepository.GetAuthToken();
            request.Headers.Authorization = AuthenticationHeaderValue.Parse($"bearer {authToken}");
            request.Headers.Add("User-Agent", "Reddit-Bot");
        }
    }
}