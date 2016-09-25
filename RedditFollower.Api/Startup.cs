
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(RedditFollower.Api.Startup))]

namespace RedditFollower.Api
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
