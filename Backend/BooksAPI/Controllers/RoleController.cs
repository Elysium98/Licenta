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

        public RoleController(
            RoleManager<IdentityRole> roleManager
        )
        {
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
        [Authorize(Roles = "Admin")]
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
                    return Ok(result);
                }
                return BadRequest("Something went wrong please try again");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        ///<summary>
        ///Update a role
        ///</summary>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<object> UpdateRole(string id, RoleModel model)
        {
            try
            {
                if (model == null || model.Name == "")
                {
                    return BadRequest("Parameters are missing");
                }

                var roles = await _roleManager.FindByIdAsync(id);
                roles.Name = model.Name;
                var result = await _roleManager.UpdateAsync(roles);

                if (result.Succeeded)
                {
                    return Ok(result);
                }
                return BadRequest("Something went wrong please try again");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
