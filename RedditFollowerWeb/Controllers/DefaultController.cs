using System.Web;
using System.Web.Mvc;
using System.Linq;
using System.Collections.Generic;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using RedditFollowerCommon.Logging;
using RedditFollowerCommon.Models;
using System.Net.Http;
using System;
using System.Text;

namespace RedditFollowerWeb.Controllers
{
    public class DefaultController : Controller
    {
        private readonly ILogger _logger;

        public DefaultController(ILogger logger)
        {
            _logger = logger;
        }

        public ActionResult Index()
        {
            return View();  
        }
    }
}