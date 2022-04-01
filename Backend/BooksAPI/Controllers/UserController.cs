using BooksAPI.Data.Entities;
using BooksAPI.Enums;
using BooksAPI.ViewModels;
using BooksAPI.ViewModels.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace BooksAPI.Controllers
{
    [ApiController]
    [Route("/users")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        private readonly UserManager<User> _userManager;

        private readonly SignInManager<User> _signInManager;

        private readonly RoleManager<IdentityRole> _roleManager;

        private readonly JWTConfig _jWTConfig;

        public UserController(
            ILogger<UserController> logger,
            UserManager<User> userManager,
            SignInManager<User> signManager,
            IOptions<JWTConfig> jwtConfig,
            RoleManager<IdentityRole> roleManager
        )
        {
            _userManager = userManager;
            _signInManager = signManager;
            _roleManager = roleManager;
            _logger = logger;
            _jWTConfig = jwtConfig.Value;
        }

        [HttpPost("register")]
        public async Task<object> RegisterUser([FromBody] RegisterModel model)
        {
            try
            {
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

                    return await Task.FromResult(
                        new ResponseModel(ResponseCode.OK, "User has been Registered", null)
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
        ///Get All User from database
        ///</summary>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet()]
        public async Task<object> GetUsers()
        {
            try
            {
                var users = _userManager.Users.Select(
                    x => new UserDTO(x.FullName, x.Email, x.UserName, x.DateCreated)
                );

                return await Task.FromResult(users);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(
                    new ResponseModel(ResponseCode.Error, ex.Message, null)
                );
            }
        }

        ///<summary>
        ///To login into App
        ///</summary>
        ///<param name="model"></param>
        //
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
                        var user = new UserDTO(
                            appUser.FullName,
                            appUser.Email,
                            appUser.UserName,
                            appUser.DateCreated
                        );
                        user.Token = GenerateToken(appUser);

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

        private string GenerateToken(User user)
        {
            var claims = new List<System.Security.Claims.Claim>()
            {
                new System.Security.Claims.Claim(JwtRegisteredClaimNames.NameId, user.Id),
                new System.Security.Claims.Claim(JwtRegisteredClaimNames.Email, user.Email),
                new System.Security.Claims.Claim(
                    JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString()
                ),
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
    }
}
