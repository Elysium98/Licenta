using System.ComponentModel.DataAnnotations;

namespace BooksAPI.ViewModels
{
    public class ConfirmEmailModel
    {
        [Required]
        public string Token { get; set; }

        [Required]
        public string UserId { get; set; }
    }
}
