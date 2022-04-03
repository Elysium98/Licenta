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
using System.Security.Claims;
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

        private readonly JWTConfig _jWTConfig;

        private readonly RoleManager<IdentityRole> _roleManager;

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
                    await _userManager.AddToRoleAsync(tempUser, model.Role);

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
        ///Get All Users
        ///</summary>
        //       [Authorize(Roles ="Admin")]
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
        ///Get All Users by Role
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

        [HttpGet("getRoles")]
        public async Task<object> GetRoles()
        {
            try
            {
                var role = _roleManager.Roles.Select(x => x).ToList();

                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "", role));
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

        [Authorize(Roles = "Admin")]
        [HttpPost("addRole")]
        public async Task<object> AddRole([FromBody] RoleModel model)
        {
            try
            {
                if (model == null || model.Role == "")
                {
                    return await Task.FromResult(
                        new ResponseModel(ResponseCode.Error, "parameters are missing", null)
                    );
                }
                if (await _roleManager.RoleExistsAsync(model.Role))
                {
                    return await Task.FromResult(
                        new ResponseModel(ResponseCode.OK, "Role already exist", null)
                    );
                }
                var role = new IdentityRole();
                role.Name = model.Role;
                var result = await _roleManager.CreateAsync(role);
                if (result.Succeeded)
                {
                    return await Task.FromResult(
                        new ResponseModel(ResponseCode.OK, "Role added successfully", null)
                    );
                }
                return await Task.FromResult(
                    new ResponseModel(
                        ResponseCode.Error,
                        "something went wrong please try again later",
                        null
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
    }
}
