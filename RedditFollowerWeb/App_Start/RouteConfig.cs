using System.Web.Mvc;
using System.Web.Routing;

namespace RedditFollowerWeb
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
                name: "ReactTute",
                url: "react",
                defaults: new { controller = "Default", action = "ReactTute" }
            );

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
                name: "Client",
                url: "client",
                defaults: new { controller = "Default", action = "Client" }
            );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Default", action = "Index", id = UrlParameter.Optional }
            );


        }
    }
}
