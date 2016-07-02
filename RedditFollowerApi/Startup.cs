
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(RedditFollowerApi.Startup))]

namespace RedditFollowerApi
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
