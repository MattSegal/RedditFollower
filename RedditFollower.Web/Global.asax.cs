﻿using System.Web.Mvc;
using System.Web.Routing;

using LightInject;

using RedditFollower.Common.Logging;


namespace RedditFollower.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Dependency Injection - currenty works by magic
            var container = new ServiceContainer();
            container.RegisterControllers();
            container.Register<ILogger, Logger>(new PerScopeLifetime());
            container.EnableMvc();

            // Everything else.
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
