using System.ComponentModel.DataAnnotations;

namespace NoticeAPI.Models
{
    public class NoticeData
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Author { get; set; } = string.Empty;

        public Location? Location { get; set; }
    }
}