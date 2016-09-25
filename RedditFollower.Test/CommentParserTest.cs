using RedditFollower.Common.Models;
using RedditFollower.Api.Service;
using System.Collections.Generic;
using Xunit;

namespace RedditFollower.Test
{
    public class CommentParserTest
    {
        [Fact]
        public void TestNoMarkup()
        {
            // Arrange
            var inputComment = new CommentMarkup(" aaa bbb ccc ddd  eee", Markup.RawText);
            var expectedComment = new List<CommentMarkup>
            {
                new CommentMarkup("aaa bbb ccc ddd  eee", Markup.Text),
            };

            // Act
            var actualComment = CommentParser.ParseComment(inputComment);

            // Assert
            MarkupAssert.AssertCommentEqual(expectedComment, actualComment);
        }

        [Fact]
        public void TestFindNewline()
        {
            // Arrange
            var inputComment = new CommentMarkup("aaa bbb \nccc\n ddd \n eee", Markup.RawText);
            var expectedComment = new List<CommentMarkup>
            {
                new CommentMarkup("aaa bbb", Markup.Text),
                new CommentMarkup(Markup.NewLine),
                new CommentMarkup("ccc", Markup.Text),
                new CommentMarkup(Markup.NewLine),
                new CommentMarkup("ddd", Markup.Text),
                new CommentMarkup(Markup.NewLine),
                new CommentMarkup("eee", Markup.Text),
                new CommentMarkup(Markup.NewLine)
            };

            // Act
            var actualComment = CommentParser.ParseComment(inputComment);

            // Assert
            MarkupAssert.AssertCommentEqual(expectedComment, actualComment);
        }

        [Fact]
        public void TestFindQuote()
        {
            // Arrange
            var inputComment = new CommentMarkup(">aaa bbb \n> ccc\n > ddd \n eee\nf", Markup.RawText);
            var expectedComment = new List<CommentMarkup>
            {
                new CommentMarkup("aaa bbb", Markup.Quote),
                new CommentMarkup(Markup.NewLine),
                new CommentMarkup("ccc", Markup.Quote),
                new CommentMarkup(Markup.NewLine),
                new CommentMarkup("ddd", Markup.Quote),
                new CommentMarkup(Markup.NewLine),
                new CommentMarkup("eee", Markup.Text),
                new CommentMarkup(Markup.NewLine),
                new CommentMarkup("f", Markup.Text),
                new CommentMarkup(Markup.NewLine)
            };

            // Act
            var actualComment = CommentParser.ParseComment(inputComment);

            // Assert
            MarkupAssert.AssertCommentEqual(expectedComment, actualComment);
        }

        [Fact]
        public void TestFindLink()
        {
            // Arrange
            var inputComment = new CommentMarkup("aaaa [bbbb](cccc) dddd", Markup.RawText);
            var expectedComment = new List<CommentMarkup>
            {
                new CommentMarkup("aaaa", Markup.Text),
                new CommentMarkup("[bbbb](cccc)", Markup.AnchorLink),
                new CommentMarkup("dddd", Markup.Text),
            };

            // Act
            var actualComment = CommentParser.ParseComment(inputComment);

            // Assert
            MarkupAssert.AssertCommentEqual(expectedComment, actualComment);
        }
    }

    public static class MarkupAssert
    {
        public static void AssertCommentEqual(List<CommentMarkup> a, List<CommentMarkup> b)
        {
            Assert.Equal(a.Count, b.Count);
            for (int i = 0; i < a.Count; i++)
            {
                AssertMarkupEqual(a[i], b[i]);
            }
        }
        public static void AssertMarkupEqual(CommentMarkup a, CommentMarkup b)
        {
            Assert.Equal(a.type, b.type);
            Assert.Equal(a.text, b.text);
            Assert.Equal(a.hyperlink, b.hyperlink);
        }
    }
}
