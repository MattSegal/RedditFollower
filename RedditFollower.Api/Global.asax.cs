using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

using RedditFollower.Common.Logging;
using LightInject;

namespace RedditFollower.Api
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Dependency Injection - currenty works by magic
            var container = new ServiceContainer();
            container.RegisterControllers();
            container.Register<ILogger, Logger>(new PerScopeLifetime());
            container.EnableMvc();

            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
