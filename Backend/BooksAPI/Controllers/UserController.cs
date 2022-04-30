using BooksAPI.Data.Entities;
using BooksAPI.Models;
using BooksAPI.Services.Email;
using BooksAPI.ViewModels;
using BooksAPI.ViewModels.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Web;

namespace BooksAPI.Controllers
{
    [ApiController]
    [Route("/users")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        private readonly UserManager<ApplicationUser> _userManager;

        private readonly SignInManager<ApplicationUser> _signInManager;

        private readonly JWTConfig _jWTConfig;

        private readonly RoleManager<IdentityRole> _roleManager;

        private readonly IConfiguration _config;
        private readonly IEmailSender _emailSender;

        public UserController(
            ILogger<UserController> logger,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signManager,
            IOptions<JWTConfig> jwtConfig,
            RoleManager<IdentityRole> roleManager,
            IConfiguration config,
            IEmailSender emailSender
        )
        {
            _userManager = userManager;
            _signInManager = signManager;
            _roleManager = roleManager;
            _logger = logger;
            _jWTConfig = jwtConfig.Value;
            _config = config;
            _emailSender = emailSender;
        }

        ///<summary>
        ///Register
        ///</summary>
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterModel model)
        {
            try
            {
                if (!await _roleManager.RoleExistsAsync(model.Role))
                {
                    return BadRequest("Role does not exist");
                }
                var user = new ApplicationUser()
                {
                    FullName = model.FullName,
                    Email = model.Email,
                    UserName = model.Email,
                    DateCreated = DateTime.UtcNow,
                    DateModified = DateTime.UtcNow
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    var tempUser = await _userManager.FindByEmailAsync(model.Email);

                    //var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);


                    //var uriBuilder = new UriBuilder(_config["ReturnPaths:ConfirmEmail"]);
                    //var query = HttpUtility.ParseQueryString(uriBuilder.Query);
                    //query["token"] = token;
                    //query["userid"] = tempUser.Id;
                    //uriBuilder.Query = query.ToString();
                    //var urlString = uriBuilder.ToString();

                    //var senderEmail = _config["ReturnPaths:SenderEmail"];

                    //await _emailSender.SendEmailAsync(senderEmail, tempUser.Email, "Confirm your email address", urlString);


                    await _userManager.AddToRoleAsync(tempUser, model.Role);

                    return Ok(tempUser);
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        ///<summary>
        ///Gets all users
        ///</summary>
        // [Authorize(Roles = "User")]
        // [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet()]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                List<UserDTO> UserDTO = new List<UserDTO>();
                var users = _userManager.Users.ToList();
                foreach (var user in users)
                {
                    var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
                    UserDTO.Add(
                        new UserDTO(
                            user.Id,
                            user.FullName,
                            user.Email,
                            user.UserName,
                            user.DateCreated,
                            role
                        )
                    );
                }
                if (UserDTO.Count == 0)
                {
                    return NoContent();
                }
                //  return await Task.FromResult(allUserDTO);
                return Ok(UserDTO);
            }
            catch (Exception ex)
            {
                // return await Task.FromResult(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        ///<summary>
        ///Get a user by id
        ///</summary>
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
          
            try
            {
                var foundUser = await _userManager.FindByIdAsync(id);

                var role = (await _userManager.GetRolesAsync(foundUser)).FirstOrDefault();

                var userDTO = new UserDTO(
                           foundUser.Id,
                           foundUser.FullName,
                           foundUser.Email,
                           foundUser.UserName,
                           foundUser.DateCreated,
                           role
                       );
                
                if (foundUser == null)
                {
                    return NotFound();
                }

                return Ok(userDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        ///<summary>
        ///Gets all users by role
        ///</summary>

        [HttpGet("{role}", Name = "getUsersByRole")]
        public async Task<object> GetUsersByRole(string role)
        {
            try
            {
                List<UserDTO> allUserDTO = new List<UserDTO>();
                var users = _userManager.Users.ToList();
                foreach (var user in users)
                {
                    var roles = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
                    if (roles == role)
                    {
                        allUserDTO.Add(
                            new UserDTO(
                                user.Id,
                                user.FullName,
                                user.Email,
                                user.UserName,
                                user.DateCreated,
                                roles
                            )
                        );
                    }
                }
                return await Task.FromResult(allUserDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        ///<summary>
        ///Login
        ///</summary>
        ///<param name="model"></param>

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = await _signInManager.PasswordSignInAsync(
                        model.Email,
                        model.Password,
                        false,
                        false
                    );

                    if (result.Succeeded)
                    {
                        var appUser = await _userManager.FindByEmailAsync(model.Email);
                        var role = (await _userManager.GetRolesAsync(appUser)).FirstOrDefault();
                        var user = new UserDTO(
                            appUser.Id,
                            appUser.FullName,
                            appUser.Email,
                            appUser.UserName,
                            appUser.DateCreated,
                            role
                        );
                        user.Token = GenerateToken(appUser, role);

                        return Ok(user);
                    }
                }
                return BadRequest("Invalid email or password");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        ///<summary>
        ///Delete a user by id
        ///</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string Id)
        {
            var user = await _userManager.FindByIdAsync(Id);

            try
            {
                if (user == null)
                {
                    return BadRequest("User Id is null");
                }

                await _userManager.DeleteAsync(user);

                return Ok("User deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private string GenerateToken(ApplicationUser user, string role)
        {
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, role),
            };

            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jWTConfig.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                ),
                Audience = _jWTConfig.Audience,
                Issuer = _jWTConfig.Issuer
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        [HttpPost("confirmEmail")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            var result = await _userManager.ConfirmEmailAsync(user, model.Token);

            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest();
        }


        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(User);

                var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

                if (result.Succeeded)
                {
                    await _signInManager.RefreshSignInAsync(user);
                    return Ok(model);
                }
               
            }
            return BadRequest();
        }




    }
}
