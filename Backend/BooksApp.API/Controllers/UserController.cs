using BooksApp.Services.Implementation;
using BooksApp.Services.Interfaces;
using BooksApp.Services.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BooksApp.API.Controllers
{
    [Route("/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPhotoService _photoService;
        public UserController(IUserService userService, IPhotoService photoService)
        {
            _userService = userService;
            _photoService = photoService;
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserModel>> GetUserById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound($"User with id '{id}' not found.");

            return Ok(user);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserModel>>> GetUsers([FromQuery] string role = null)
        {
            var users = await _userService.GetUsersAsync(role);
            return Ok(users);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPut("changePassword/{id}")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model, string id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, errorMessage) = await _userService.ChangePasswordAsync(model, id);

            if (!success)
                return BadRequest(errorMessage);

            return Ok(model);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                await _userService.DeleteAsync(id);
                return Ok("User deleted successfully");
            }
            catch (KeyNotFoundException)
            {
                return NotFound($"User with id '{id}' not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (succeeded, result) = await _userService.RegisterUserAsync(model);
            if (succeeded)
                return Ok(result);

            return BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid data");

                var (succeeded, result) = await _userService.LoginAsync(model);

                if (!succeeded)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserModel model)
        {
            var (success, errorMessage) = await _userService.UpdateUserAsync(id, model);
            if (!success)
                return BadRequest(new { error = errorMessage });

            return Ok();
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPut("updatePhoto/{id}")]
        public async Task<IActionResult> UpdatePhoto(string id, IFormFile file)
        {
            if (file == null)
                return BadRequest("No file uploaded.");

            var (success, path, error) = await _photoService.SavePhotoAsync(file, "Users");
            if (!success)
                return BadRequest(error);

            var updated = await _userService.UpdateUserImagePathAsync(id, path);
            if (!updated)
                return NotFound("User not found.");

            return Ok(new { ImagePath = path });
        }
    }
}
