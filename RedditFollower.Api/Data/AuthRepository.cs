using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Configuration;

using Newtonsoft.Json;

using RedditFollower.Common.Logging;
using RedditFollower.Common.Models;

namespace RedditFollower.Api.Authentication
{
    public static class AuthRepository
    {
        private static readonly string _redditAuthUri = "https://www.reddit.com/api/v1/access_token";
        private static readonly string _basicAuthHeader;

        private static string _oAuthToken;
        private static DateTime _tokenExpiryTime;

        static AuthRepository()
        {
            _tokenExpiryTime = DateTime.Now;
            _basicAuthHeader = ConfigurationManager.AppSettings.Get("BasicAuthHeader");
        }

        public static string GetAuthToken()
        {
            if (_tokenExpiryTime <= DateTime.Now || String.IsNullOrWhiteSpace(_oAuthToken))
            {
                using (var client = new HttpClient())
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
                    HttpResponseMessage response = client.SendAsync(request).Result;
                    response.EnsureSuccessStatusCode();
                    string responseBody = response.Content.ReadAsStringAsync().Result;
                    AuthResponse authResponse = JsonConvert.DeserializeObject<AuthResponse>(responseBody);

                    _oAuthToken = authResponse.access_token;
                    _tokenExpiryTime = _tokenExpiryTime.AddSeconds(authResponse.expires_in);
                }
            }
            //System.Diagnostics.Debug.WriteLine($"Auth Token: {_oAuthToken}");
            return _oAuthToken;            
        }
    }
}