namespace RedditFollower.Common.Logging
{
    public class Logger : ILogger
    {
        public void Log(string message)
        {
            // use NLog when you get around to it
            System.Diagnostics.Debug.WriteLine(message);
        }
    }
}