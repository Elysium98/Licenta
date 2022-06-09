using BooksAPI.Data.Entities;
using BooksAPI.Models;
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
using System.Net.Http.Headers;
using System.Web;
using System.Net.Mail;

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

        public UserController(
            ILogger<UserController> logger,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signManager,
            IOptions<JWTConfig> jwtConfig,
            RoleManager<IdentityRole> roleManager,
            IConfiguration config
        )
        {
            _userManager = userManager;
            _signInManager = signManager;
            _roleManager = roleManager;
            _logger = logger;
            _jWTConfig = jwtConfig.Value;
            _config = config;
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
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Study = model.Study,
                    Image = model.Image,
                    City = model.City,
                    BirthDate = model.BirthDate,
                    PhoneNumber = model.PhoneNumber,
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

                    return Ok(tempUser);
                }
                return BadRequest(result);
                
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

   

        ///<summary>
        ///Gets all users
        ///</summary>

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
                            user.FirstName,
                            user.LastName,
                            user.Study,
                            user.Image,
                            user.City,
                            user.BirthDate,
                            user.PhoneNumber,
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

                return Ok(UserDTO);
            }
            catch (Exception ex)
            {
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
                    foundUser.FirstName,
                    foundUser.LastName,
                    foundUser.Study,
                    foundUser.Image,
                    foundUser.City,
                    foundUser.BirthDate,
                    foundUser.PhoneNumber,
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
                                user.FirstName,
                                user.LastName,
                                user.Study,
                                user.Image,
                                user.City,
                                user.BirthDate,
                                user.PhoneNumber,
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
                            appUser.FirstName,
                            appUser.LastName,
                            appUser.Study,
                            appUser.Image,
                            appUser.City,
                            appUser.BirthDate,
                            appUser.PhoneNumber,
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
        /// Update user photo
        ///</summary>
        [Authorize(Roles = "User,Admin")]
        [HttpPut("user/updatePhoto/{id}")]
        public async Task<IActionResult> UpdatePhoto(string id, ImageModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindByIdAsync(id);
                    var roles = await _userManager.GetRolesAsync(user);
                    if (user == null)
                    {
                        return NotFound();
                    }

                    user.Image = model.Image;

                    var result = await _userManager.UpdateAsync(user);
                    if (result.Succeeded)
                    {
                        await _signInManager.RefreshSignInAsync(user);
                        return Ok(user);
                    }
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        ///<summary>
        /// Update a user
        ///</summary>
        [Authorize(Roles = "User,Admin")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(string id, UpdateUserModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindByIdAsync(id);
                    var roles = await _userManager.GetRolesAsync(user);
                    if (user == null)
                    {
                        return NotFound();
                    }

                    user.Email = model.Email;
                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                    user.Study = model.Study;

                    user.PhoneNumber = model.PhoneNumber;

                    var result = await _userManager.UpdateAsync(user);
                    if (result.Succeeded)
                    {
                        await _signInManager.RefreshSignInAsync(user);
                        return Ok(user);
                    }
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        ///<summary>
        ///Delete a user by id
        ///</summary>
        [Authorize(Roles = "Admin")]
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

        ///<summary>
        /// Save user photo
        ///</summary>
        //  [Authorize(Roles = "User,Admin")]
        [HttpPost("savePhoto")]
        public async Task<IActionResult> UploadPhoto()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();
                var file = formCollection.Files.First();
                var folderName = Path.Combine("Resources", "Images", "Users");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue
                        .Parse(file.ContentDisposition)
                        .FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
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

        ///<summary>
        /// Change user password
        ///</summary>
        [Authorize(Roles = "User,Admin")]
        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(User);

                var result = await _userManager.ChangePasswordAsync(
                    user,
                    model.CurrentPassword,
                    model.NewPassword
                );

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
