using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Configuration;

using Newtonsoft.Json;

using RedditFollower.Common.Logging;
using RedditFollower.Common.Models;
using System.Threading.Tasks;

namespace RedditFollower.Api.Authentication
{
    public static class AuthRepository
    {
        private static readonly string _redditAuthUri = "https://www.reddit.com/api/v1/access_token";
        private static readonly string _basicAuthHeader;

        private static string _oAuthToken;
        private static DateTime _tokenExpiryTime;
        private static readonly HttpClient _httpClient;

        static AuthRepository()
        {
            _httpClient = new HttpClient();
            _tokenExpiryTime = DateTime.Now;
            _basicAuthHeader = ConfigurationManager.AppSettings.Get("BasicAuthHeader");
        }

        public static async Task<string> GetAuthToken()
        {
            if (_tokenExpiryTime <= DateTime.Now || String.IsNullOrWhiteSpace(_oAuthToken))
            {
                var request = new HttpRequestMessage()
                {
                    RequestUri = new Uri(_redditAuthUri),
                    Method = HttpMethod.Post,
                };
                request.Headers.Authorization = AuthenticationHeaderValue.Parse(_basicAuthHeader);
                var formData = new Dictionary<string, string>()
                {
                    { "grant_type", "client_credentials" }
                };
                request.Content = new FormUrlEncodedContent(formData);
                HttpResponseMessage response = await _httpClient.SendAsync(request).ConfigureAwait(false);

                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                AuthResponse authResponse = JsonConvert.DeserializeObject<AuthResponse>(responseBody);

                _oAuthToken = authResponse.access_token;
                _tokenExpiryTime = _tokenExpiryTime.AddSeconds(authResponse.expires_in);
            }
            return _oAuthToken;            
        }
    }
}