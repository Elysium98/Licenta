using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Moq;
using BooksApp.Data.Interfaces;
using BooksApp.Services.Implementation;
using BooksApp.Services.Models;
using Xunit;

namespace BooksApp.Tests.Unit
{
    public class RoleTests
    {
        private readonly Mock<IRoleRepository> _roleRepositoryMock;
        private readonly RoleService _roleService;
        private readonly IMapper _mapper;

        public RoleTests()
        {
            _roleRepositoryMock = new Mock<IRoleRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<IdentityRole, RoleModel>().ReverseMap();
            });
            _mapper = config.CreateMapper();

            _roleService = new RoleService(_roleRepositoryMock.Object, _mapper);
        }

        [Fact]
        public async Task GetAllRolesAsync_ShouldReturnMappedRoles()
        {
            // Arrange
            var roles = new List<IdentityRole>
            {
                new IdentityRole { Id = "1", Name = "Admin" },
                new IdentityRole { Id = "2", Name = "User" }
            };
            _roleRepositoryMock.Setup(r => r.GetAllRolesAsync()).ReturnsAsync(roles);

            // Act
            var result = await _roleService.GetAllRolesAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, r => r.Name == "Admin");
        }

        [Fact]
        public async Task GetRoleByIdAsync_ShouldReturnMappedRole()
        {
            // Arrange
            var role = new IdentityRole { Id = "1", Name = "Admin" };
            _roleRepositoryMock.Setup(r => r.GetRoleByIdAsync("1")).ReturnsAsync(role);

            // Act
            var result = await _roleService.GetRoleByIdAsync("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Admin", result.Name);
        }

        [Fact]
        public async Task CreateRoleAsync_ShouldReturnSuccess_WhenRoleDoesNotExist()
        {
            // Arrange
            var model = new RoleModel { Name = "Manager" };
            _roleRepositoryMock.Setup(r => r.RoleExistsAsync("Manager")).ReturnsAsync(false);
            _roleRepositoryMock.Setup(r => r.CreateRoleAsync("Manager"))
                               .ReturnsAsync(IdentityResult.Success);

            // Act
            var (Succeeded, Message) = await _roleService.CreateRoleAsync(model);

            // Assert
            Assert.True(Succeeded);
            Assert.Equal("Role created", Message);
        }

        [Fact]
        public async Task CreateRoleAsync_ShouldReturnFailure_WhenRoleExists()
        {
            // Arrange
            var model = new RoleModel { Name = "Admin" };
            _roleRepositoryMock.Setup(r => r.RoleExistsAsync("Admin")).ReturnsAsync(true);

            // Act
            var (Succeeded, Message) = await _roleService.CreateRoleAsync(model);

            // Assert
            Assert.False(Succeeded);
            Assert.Equal("Role already exists", Message);
        }

        [Fact]
        public async Task UpdateRoleAsync_ShouldReturnSuccess_WhenUpdateSucceeds()
        {
            // Arrange
            var model = new RoleModel { Name = "UpdatedRole" };
            _roleRepositoryMock.Setup(r => r.UpdateRoleAsync("1", "UpdatedRole"))
                               .ReturnsAsync(IdentityResult.Success);

            // Act
            var (Succeeded, Message) = await _roleService.UpdateRoleAsync("1", model);

            // Assert
            Assert.True(Succeeded);
            Assert.Equal("Role updated", Message);
        }

        [Fact]
        public async Task DeleteRoleAsync_ShouldReturnSuccess_WhenDeleteSucceeds()
        {
            // Arrange
            _roleRepositoryMock.Setup(r => r.DeleteRoleAsync("1"))
                               .ReturnsAsync(IdentityResult.Success);

            // Act
            var (Succeeded, Message) = await _roleService.DeleteRoleAsync("1");

            // Assert
            Assert.True(Succeeded);
            Assert.Equal("Role deleted successfully", Message);
        }
    }
}
