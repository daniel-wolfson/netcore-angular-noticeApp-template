using System.ComponentModel.DataAnnotations;

namespace NoticeAPI.Models
{
    public class Notice : NoticeData
    {
        public Guid Id { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}