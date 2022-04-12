using BooksAPI.Data.Entities;
using BooksAPI.Enums;
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

        private readonly UserManager<User> _userManager;

        public RoleController(RoleManager<IdentityRole> roleManager, UserManager<User> userManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        ///<summary>
        ///Get all roles
        ///</summary>
        [HttpGet()]
        public async Task<object> GetRoles()
        {
            try
            {
                var roles = _roleManager.Roles.ToList();

                return await Task.FromResult(new ResponseModel(ResponseCode.OK, "", roles));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(
                    new ResponseModel(ResponseCode.Error, ex.Message, null)
                );
            }
        }

        ///<summary>
        ///Get a role by id
        ///</summary>
        [HttpGet("{id}")]
        public async Task<object> GetRole(string id)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(id);

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
        ///Delete a role by id
        ///</summary>
        [HttpDelete("{id}")]
        public async Task<object> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);

            try
            {
                var result = await _roleManager.DeleteAsync(role);

                return await Task.FromResult(
                    new ResponseModel(ResponseCode.OK, "Role deleted successfully", null)
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
        ///Add a role
        ///</summary>
        //   [Authorize(Roles = "Admin")]
        [HttpPost()]
        public async Task<object> AddRole([FromBody] RoleModel model)
        {
            try
            {
                if (model == null || model.Role == "")
                {
                    return await Task.FromResult(
                        new ResponseModel(ResponseCode.Error, "Parameters are missing", null)
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
                        "Something went wrong please try again",
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
