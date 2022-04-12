using BooksAPI.Data.Entities;
using BooksAPI.Enums;
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

        private readonly UserManager<User> _userManager;

        private readonly SignInManager<User> _signInManager;

        private readonly JWTConfig _jWTConfig;

        private readonly RoleManager<IdentityRole> _roleManager;

        private readonly IConfiguration _config;
        private readonly IEmailSender _emailSender;

        public UserController(
            ILogger<UserController> logger,
            UserManager<User> userManager,
            SignInManager<User> signManager,
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
        public async Task<object> RegisterUser([FromBody] RegisterModel model)
        {
            try
            {
                if (!await _roleManager.RoleExistsAsync(model.Role))
                {
                    return await Task.FromResult(
                        new ResponseModel(ResponseCode.Error, "Role does not exist", null)
                    );
                }
                var user = new User()
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

                    return await Task.FromResult(
                        new ResponseModel(ResponseCode.OK, "User has been registered", null)
                    );
                }
                return await Task.FromResult(
                    new ResponseModel(
                        ResponseCode.Error,
                        "",
                        result.Errors.Select(x => x.Description).ToArray()
                    )
                );
            }
            catch (Exception ex)
            {
                return await Task.FromResult(
                    new ResponseModel(ResponseCode.Error, ex.Message, null)
                );
            }
        }

        ///<summary>
        ///Gets all users
        ///</summary>
        //     [Authorize(Roles = "User")]
        [HttpGet()]
        public async Task<object> GetUsers()
        {
            try
            {
                List<UserDTO> allUserDTO = new List<UserDTO>();
                var users = _userManager.Users.ToList();
                foreach (var user in users)
                {
                    var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
                    allUserDTO.Add(
                        new UserDTO(
                            user.FullName,
                            user.Email,
                            user.UserName,
                            user.DateCreated,
                            role
                        )
                    );
                }
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "", users));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(
                    new ResponseModel(ResponseCode.Error, ex.Message, null)
                );
            }
        }

        ///<summary>
        ///Get a user by id
        ///</summary>
        [HttpGet("user/{id}")]
        public async Task<object> GetUser(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);

                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "", user));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(
                    new ResponseModel(ResponseCode.Error, ex.Message, null)
                );
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
                                user.FullName,
                                user.Email,
                                user.UserName,
                                user.DateCreated,
                                roles
                            )
                        );
                    }
                }
                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "", allUserDTO));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(
                    new ResponseModel(ResponseCode.Error, ex.Message, null)
                );
            }
        }

        ///<summary>
        ///Login
        ///</summary>
        ///<param name="model"></param>

        [HttpPost("login")]
        public async Task<object> Login([FromBody] LoginModel model)
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
                            appUser.FullName,
                            appUser.Email,
                            appUser.UserName,
                            appUser.DateCreated,
                            role
                        );
                        user.Token = GenerateToken(appUser, role);

                        return await Task.FromResult(new ResponseModel(ResponseCode.OK, "", user));
                    }
                }
                return await Task.FromResult(
                    new ResponseModel(ResponseCode.Error, "Invalid email or password", null)
                );
            }
            catch (Exception ex)
            {
                return await Task.FromResult(
                    new ResponseModel(ResponseCode.Error, ex.Message, null)
                );
            }
        }

        ///<summary>
        ///Delete a user by id
        ///</summary>
        [HttpDelete("{id}")]
        public async Task<object> DeleteUser(string Id)
        {
            var user = await _userManager.FindByIdAsync(Id);

            try
            {
                var result = await _userManager.DeleteAsync(user);

                return await Task.FromResult(
                    new ResponseModel(ResponseCode.OK, "User deleted successfully", null)
                );
            }
            catch (Exception ex)
            {
                return await Task.FromResult(
                    new ResponseModel(ResponseCode.Error, ex.Message, null)
                );
            }
        }

        private string GenerateToken(User user, string role)
        {
            var claims = new List<System.Security.Claims.Claim>()
            {
                new System.Security.Claims.Claim(JwtRegisteredClaimNames.NameId, user.Id),
                new System.Security.Claims.Claim(JwtRegisteredClaimNames.Email, user.Email),
                new System.Security.Claims.Claim(
                    JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString()
                ),
                new System.Security.Claims.Claim(ClaimTypes.Role, role),
            };

            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jWTConfig.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(claims),
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
    }
}
