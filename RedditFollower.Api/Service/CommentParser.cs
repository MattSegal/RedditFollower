using System;
using System.Collections.Generic;
using System.Linq;
using RedditFollower.Common.Models;
using System.Web;
using System.Text.RegularExpressions;

namespace RedditFollower.Api.Service
{
    public static class CommentParser
    {
        public static List<CommentMarkup> ParseComment(CommentMarkup comment)
        {
            return ParseComment(new List<CommentMarkup> { comment });
        }

        public static List<CommentMarkup> ParseComment(string text)
        {
            return ParseComment(new List<CommentMarkup> { new CommentMarkup(text, Markup.RawText) });
        }

        private static Regex redditLinkRegex = new Regex(@"(\[[\s\S]+?\]\([^\)]+\))");
        //private Regex rawLinkRegex = new Regex(@"(http:|https:)\/\/[\s\S]+?\.[\s\S]+?(\s|$))");
        //private Regex italicRegex = new Regex(@"(_[^_]+_)");
        //private Regex userRegex = new Regex(@"\/u\/\w+");
        //private Regex subredditRegex = new Regex(@"\/r\/\w+");

        public static List<CommentMarkup> ParseComment(List<CommentMarkup> markups)
        {
            var processedMarkups = new List<CommentMarkup>();
            foreach (var markup in markups)
            {
                var isValidRawText = markup.type == Markup.RawText && markup.text.Length > 0;
                if (isValidRawText)
                {
                    markup.text = markup.text.Trim();

                    // Recursive cases
                    bool containsNewline = markup.text.Contains('\n');
                    if (containsNewline)
                    {
                        foreach (string text in markup.text.Split('\n'))
                        {
                            processedMarkups.AddRange(ParseComment(text));
                            processedMarkups.Add(new CommentMarkup(Markup.NewLine));
                        }
                        continue;
                    }

                    var redditLinkMatch = redditLinkRegex.Match(markup.text);
                    if (redditLinkMatch.Success)
                    {
                        string linkText = redditLinkMatch.Value;
                        string beforeText = markup.text.Substring(0, redditLinkMatch.Index - 1);
                        string afterText = markup.text.Substring(redditLinkMatch.Index + linkText.Length);

                        processedMarkups.AddRange(ParseComment(beforeText));
                        processedMarkups.Add(new CommentMarkup(linkText, Markup.AnchorLink));
                        processedMarkups.AddRange(ParseComment(afterText));
                        continue;
                    }

                    // Base cases
                    bool isQuote = markup.text[0] == '>';
                    if (isQuote)
                    {
                        string processedText = HttpUtility.HtmlDecode(markup.text.Substring(1).Trim());
                        processedMarkups.Add(new CommentMarkup(processedText, Markup.Quote));
                    }
                    else
                    {
                        string processedText = HttpUtility.HtmlDecode(markup.text);
                        processedMarkups.Add(new CommentMarkup(processedText, Markup.Text));
                    }
                }
            }
            return processedMarkups;
        }
    }
}