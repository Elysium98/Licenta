using BooksApp.Services.Interfaces;
using BooksApp.Services.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BooksApp.API.Controllers
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

        [Authorize(Roles = "User,Admin")]
        [HttpPost("sendMessage")]
        public async Task<IActionResult> Send(MailRequest request)
        {
            await mailService.SendEmailAsync(request);
            return Ok();
        }
    }

}
