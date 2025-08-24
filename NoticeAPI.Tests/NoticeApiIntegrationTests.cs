using Microsoft.AspNetCore.Mvc.Testing;
using NoticeAPI.Controllers;
using NoticeAPI.Models;
using System.Net;
using System.Net.Http.Json;

namespace NoticeAPI.Tests
{
    public class NoticeApiIntegrationTests : IClassFixture<WebApplicationFactory<NoticesController>>
    {
        private readonly WebApplicationFactory<NoticesController> _factory;
        private readonly HttpClient _client;

        public NoticeApiIntegrationTests(WebApplicationFactory<NoticesController> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task GetAllNotices_ReturnsSuccessAndJson()
        {
            // Act
            var response = await _client.GetAsync("/api/Notices");
            var notices = await response.Content.ReadFromJsonAsync<List<NoticeAPI.Models.Notice>>();

            // Assert
            Assert.True(response.StatusCode == HttpStatusCode.OK);
            Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());
            Assert.True(notices?.Count > 0);
        }

        [Fact]
        public async Task CreateNotice_ReturnsCreatedNotice()
        {
            // Arrange
            var newNotice = new NoticeData
            {
                Title = "newNotice Test",
                Content = "newNotice Test",
                Author = "Test Author",
                Location = new Location() { Latitude = 32.0853, Longitude = 34.7818 }
            };

            // Act
            var createResponse = await _client.PostAsJsonAsync("/api/Notices", newNotice);
            var createdNotice = await createResponse.Content.ReadFromJsonAsync<Notice>();

            // Assert
            Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
            Assert.NotNull(createdNotice);
            Assert.Equal(newNotice.Title, createdNotice!.Title);
            Assert.Equal(newNotice.Content, createdNotice.Content);
            Assert.Equal(newNotice.Author, createdNotice.Author);
            Assert.NotEqual(Guid.Empty, createdNotice.Id);
        }

        [Fact]
        public async Task GetNoticeById_ReturnsNotice()
        {
            // Arrange
            var allNoticesResponse = await _client.GetAsync("/api/Notices");
            var allNotices = await allNoticesResponse.Content.ReadFromJsonAsync<List<Notice>>();
            var expectedNotice = allNotices?[Random.Shared.Next(allNotices.Count)];
            Assert.NotNull(expectedNotice);

            // Act
            var getResponse = await _client.GetAsync($"/api/Notices/{expectedNotice?.Id}");
            var actualNotice = await getResponse.Content.ReadFromJsonAsync<Notice>();

            // Assert
            Assert.NotEqual(Guid.Empty, expectedNotice?.Id);
            Assert.False(string.IsNullOrWhiteSpace(expectedNotice?.Title));
            Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
            Assert.NotNull(actualNotice);
        }

        [Fact]
        public async Task UpdateNotice_ReturnsUpdatedNotice()
        {
            // Arrange
            var expectedNotice = new NoticeData
            {
                Title = "Update Test - Updated",
                Content = "After update.",
                Author = "Test Author Updated",
                Location = null
            };

            // Act
            var response = await _client.GetAsync("/api/Notices");
            var allNotices = await response.Content.ReadFromJsonAsync<List<Notice>>();
            var existNoticeId = allNotices?.FirstOrDefault()?.Id;
            Assert.NotNull(existNoticeId);

            var updateNoticeResponse = await _client.PutAsJsonAsync($"/api/Notices/{existNoticeId}", expectedNotice);
            var actualNotice = await updateNoticeResponse.Content.ReadFromJsonAsync<Notice>();
            Assert.NotNull(actualNotice);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.NotNull(actualNotice);
            Assert.Equal(expectedNotice.Title, actualNotice.Title);
            Assert.Equal(expectedNotice.Content, actualNotice.Content);
            Assert.Equal(expectedNotice.Author, actualNotice.Author);
        }

        [Fact]
        public async Task DeleteNotice_ReturnsNoContent()
        {
            // Arrange
            var response = await _client.GetAsync("/api/Notices");
            var allNotices = await response.Content.ReadFromJsonAsync<List<Notice>>();
            var actualNoticeId = allNotices?.FirstOrDefault()?.Id ?? throw new NullReferenceException();

            // Act
            var deleteResponse = await _client.DeleteAsync($"/api/Notices/{actualNoticeId}");

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            // Verify it is deleted
            var getResponse = await _client.GetAsync($"/api/Notices/{actualNoticeId}");
            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }
    }
}
