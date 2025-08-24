using NoticeAPI.Models;

namespace NoticeAPI.Interfaces
{
    public interface INoticeDataService
    {
        Task<List<Notice>> GetAllNoticesAsync();
        Task<Notice?> GetNoticeByIdAsync(Guid id);
        Task<Notice> AddNoticeAsync(NoticeData notice);
        Task<Notice> UpdateNoticeAsync(Guid id, NoticeData notice);
        Task<bool> DeleteNoticeAsync(Guid id);
    }

    
}