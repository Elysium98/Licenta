using BooksAPI.Models;
using BooksAPI.Services;
using Google.Apis.Auth.OAuth2;
using MailKit.Security;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using System.Net.Mail;
using MimeKit.Text;

namespace BooksAPI.Controllers
{
    [ApiController]
    [Route("/email")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService mailService;

        public EmailController(IEmailService mailService)
        {
            this.mailService = mailService;
        }

        [HttpPost("sendMessage")]
        public async Task<IActionResult> Send(MailRequest request)
        {
            try
            {
                await mailService.SendEmailAsync(request);
                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
