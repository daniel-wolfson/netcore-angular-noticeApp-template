using Microsoft.Extensions.Configuration;
using NoticeAPI.Interfaces;
using NoticeAPI.Models;
using System.Text.Json;

namespace NoticeAPI.Services
{
    public class NoticeDataService : INoticeDataService
    {
        private readonly string _dataFilePath;
        private readonly ILogger<NoticeDataService> _logger;
        private readonly SemaphoreSlim _fileSemaphore = new(1, 1);

        public NoticeDataService(IConfiguration configuration, ILogger<NoticeDataService> logger)
        {
            _logger = logger;
            var dataFilePath = configuration.GetValue<string>("ApiConfig:NoticeDataPath") ?? "Data/notices.json";
            var assemblyFolder = AppContext.BaseDirectory;
            _dataFilePath = Path.Combine(assemblyFolder, "Data/notices.json");
        }

        public async Task<List<Notice>> GetAllNoticesAsync()
        {
            await _fileSemaphore.WaitAsync();
            try
            {
                if (!File.Exists(_dataFilePath))
                {
                    return [];
                }

                var json = await File.ReadAllTextAsync(_dataFilePath);
                if (string.IsNullOrEmpty(json))
                {
                    return [];
                }

                var notices = JsonSerializer.Deserialize<List<Notice>>(json, GetJsonOptions());
                return notices ?? [];
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reading notices from file");
                return [];
            }
            finally
            {
                _fileSemaphore.Release();
            }
        }

        public async Task<Notice?> GetNoticeByIdAsync(Guid id)
        {
            var notices = await GetAllNoticesAsync();
            return notices.FirstOrDefault(n => n.Id == id);
        }

        public async Task<Notice> AddNoticeAsync(NoticeData noticeData)
        {
            try
            {
                var notice = new Notice() {
                    Id = Guid.NewGuid(),
                    Title = noticeData.Title,
                    Content = noticeData.Content,
                    Author = noticeData.Author,
                    CreatedAt = DateTime.UtcNow,
                    Location = noticeData.Location
                };

                var notices = await GetAllNoticesAsync();
                notices.Add(notice);
                await WriteNoticesAsync(notices);

                _logger.LogInformation("Notice {Id} created by {Author}", notice.Id, notice.Author);
                return notice;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddNoticeAsync failed");
                throw;
            }
        }

        public async Task<Notice?> UpdateNoticeAsync(Guid id, NoticeData updatedNotice)
        {
            var notices = await GetAllNoticesAsync();

            try
            {
                var existingNotice = notices.FirstOrDefault(n => n.Id == id);
                if (existingNotice == null)
                {
                    return null;
                }

                // Update properties but keep original Id and CreatedAt
                existingNotice.Title = updatedNotice.Title;
                existingNotice.Content = updatedNotice.Content;
                existingNotice.Author = updatedNotice.Author;
                existingNotice.Location = updatedNotice.Location;

                await WriteNoticesAsync(notices);

                _logger.LogInformation("Notice {Id} updated by {Author}", id, updatedNotice.Author);
                return existingNotice;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateNoticeAsync failed");
                return null;
            }
        }

        public async Task<bool> DeleteNoticeAsync(Guid id)
        {
            var notices = await GetAllNoticesAsync();

            try
            {
                var noticeToDelete = notices.FirstOrDefault(n => n.Id == id);
                if (noticeToDelete == null)
                {
                    return false;
                }

                notices.Remove(noticeToDelete);
                await WriteNoticesAsync(notices);

                _logger.LogInformation("Notice {Id} deleted", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteNoticeAsync failed");
                return false;
            }
        }

        private async Task WriteNoticesAsync(List<Notice> notices)
        {
            await _fileSemaphore.WaitAsync();
            try
            {
                
                var json = JsonSerializer.Serialize(notices, GetJsonOptions());
                await File.WriteAllTextAsync(_dataFilePath, json);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error writing notices to file");
                throw;
            }
            finally
            {
                _fileSemaphore.Release();
            }
        }

        private static JsonSerializerOptions GetJsonOptions()
        {
            return new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
        }
    }
}
