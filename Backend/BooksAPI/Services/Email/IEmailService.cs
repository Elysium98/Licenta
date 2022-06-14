using BooksAPI.Models;

namespace BooksAPI.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(MailRequest mailRequest);
    }
}
