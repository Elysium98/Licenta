using BooksAPI.Data.Entities;
using BooksAPI.Services;
using BooksAPI.ViewModels;
using BooksAPI.ViewModels.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BooksAPI.Controllers
{
    [ApiController]
    [Route("/roles")]
    public class RoleController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        private readonly UserManager<ApplicationUser> _userManager;

        public RoleController(
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager
        )
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        ///<summary>
        ///Get all roles
        ///</summary>
        [HttpGet()]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var roles = _roleManager.Roles.ToList();

                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        ///<summary>
        ///Get a role by id
        ///</summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRole(string id)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(id);

                return Ok(role);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        ///<summary>
        ///Delete a role by id
        ///</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);

            try
            {
                var result = await _roleManager.DeleteAsync(role);

                return Ok("Role deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        ///<summary>
        ///Add a role
        ///</summary>
        //   [Authorize(Roles = "Admin")]
        [HttpPost()]
        public async Task<IActionResult> AddRole([FromBody] RoleModel model)
        {
            try
            {
                if (model == null || model.Name == "")
                {
                    return BadRequest("Parameters are missing");
                }
                if (await _roleManager.RoleExistsAsync(model.Name))
                {
                    return BadRequest("Role already exist");
                }
                var role = new IdentityRole();
                role.Name = model.Name;
                var result = await _roleManager.CreateAsync(role);
                if (result.Succeeded)
                {
                    return Ok("Role added successfully");
                }
                return BadRequest("Something went wrong please try again");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /////<summary>
        /////Update a role
        /////</summary>

        //[HttpPut()]
        //public async Task<object> UpdateRole(string id,  RoleModel role)
        //{
        //    try
        //    {
        //        if (role == null || role.Role == "")
        //        {
        //            return await Task.FromResult(
        //                new ResponseModel(ResponseCode.Error, "Parameters are missing", null)
        //            );
        //        }

        //        var roles = await _roleManager.FindByIdAsync(id);
        //        roles.Name = role.Role;
        //        var result = await _roleManager.UpdateAsync(roles);

        //        foreach (var user in _userManager.Users)
        //        {
        //            if (await _userManager.IsInRoleAsync(user, role.Name))
        //            {
        //                // model.U
        //            }
        //        }


        //        if (result.Succeeded)
        //        {
        //            return await Task.FromResult(
        //                new ResponseModel(ResponseCode.OK, "Role added successfully", result)
        //            );
        //        }
        //        return await Task.FromResult(
        //            new ResponseModel(
        //                ResponseCode.Error,
        //                "Something went wrong please try again",
        //                null
        //            )
        //        );
        //    }
        //    catch (Exception ex)
        //    {
        //        return await Task.FromResult(
        //            new ResponseModel(ResponseCode.Error, ex.Message, null)
        //        );
        //    }
        //}

    }
}
