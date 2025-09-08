using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Moq;
using BooksApp.Data.Entities;
using BooksApp.Data.Interfaces;
using BooksApp.Services.Implementation;
using BooksApp.Services.Models;
using Microsoft.Extensions.Options;
using Xunit;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace BooksApp.Tests.Unit
{
    public class UserTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly UserService _userService;
        private readonly IMapper _mapper;
        private readonly IOptions<JWTConfig> _jwtOptions;

        public UserTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<UserEntity, UserModel>().ReverseMap();
                cfg.CreateMap<RegisterModel, UserEntity>().ReverseMap();
            });
            _mapper = config.CreateMapper();

            _jwtOptions = Options.Create(new JWTConfig
            {
                Key = "12345678901234567890123456789012",
                Issuer = "TestIssuer",
                Audience = "TestAudience"
            });


            _userService = new UserService(_userRepositoryMock.Object, _mapper, _jwtOptions);
        }

        [Fact]
        public async Task RegisterUserAsync_ShouldReturnSuccess_WhenRoleExists()
        {
            // Arrange
            var model = new RegisterModel { Email = "test@example.com", Password = "Password123!", Role = "User" };
            _userRepositoryMock.Setup(r => r.RegisterUserAsync(It.IsAny<UserEntity>(), model.Password, model.Role))
                               .ReturnsAsync((true, new UserEntity { Email = model.Email }));

            // Act
            var (Succeeded, Result) = await _userService.RegisterUserAsync(model);

            // Assert
            Assert.True(Succeeded);
            Assert.IsType<UserEntity>(Result);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnUserModel_WhenUserExists()
        {
            // Arrange
            var user = new UserEntity { Id = "1", Email = "test@example.com" };
            _userRepositoryMock.Setup(r => r.GetByIdAsync("1")).ReturnsAsync(user);
            _userRepositoryMock.Setup(r => r.GetUserRoleAsync(user)).ReturnsAsync("User");

            // Act
            var result = await _userService.GetByIdAsync("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("1", result.Id);
            Assert.Equal("User", result.Role);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnMappedUsers()
        {
            // Arrange
            var users = new List<UserEntity>
            {
                new UserEntity { Id = "1", Email = "a@example.com" },
                new UserEntity { Id = "2", Email = "b@example.com" }
            };
            _userRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(users);

            // Act
            var result = await _userService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task DeleteAsync_ShouldCallDelete_WhenUserExists()
        {
            // Arrange
            var user = new UserEntity { Id = "1" };
            _userRepositoryMock.Setup(r => r.GetByIdAsync("1")).ReturnsAsync(user);
            _userRepositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            await _userService.DeleteAsync("1");

            // Assert
            _userRepositoryMock.Verify(r => r.Delete(user), Times.Once);
            _userRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_ShouldThrow_WhenUserDoesNotExist()
        {
            // Arrange
            _userRepositoryMock.Setup(r => r.GetByIdAsync("99")).ReturnsAsync((UserEntity)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _userService.DeleteAsync("99"));
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnSuccess_WhenValidCredentials()
        {
            // Arrange
            var user = new UserEntity { Id = "1", Email = "test@example.com" };
            var model = new LoginModel { Email = "test@example.com", Password = "Password123!" };

            _userRepositoryMock.Setup(r => r.ValidateUserAsync(model.Email, model.Password))
                               .ReturnsAsync(user);
            _userRepositoryMock.Setup(r => r.GetUserRoleAsync(user)).ReturnsAsync("User");

            // Act
            var (Succeeded, Result) = await _userService.LoginAsync(model);

            // Assert
            Assert.True(Succeeded);
            var response = Assert.IsType<UserLoginResponseModel>(Result);
            Assert.Equal("1", response.Id);
            Assert.Equal("User", response.Role);
            Assert.False(string.IsNullOrEmpty(response.Token));
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnFailure_WhenInvalidCredentials()
        {
            // Arrange
            var model = new LoginModel { Email = "wrong@example.com", Password = "Password123!" };
            _userRepositoryMock.Setup(r => r.ValidateUserAsync(model.Email, model.Password)).ReturnsAsync((UserEntity)null);

            // Act
            var (Succeeded, Result) = await _userService.LoginAsync(model);

            // Assert
            Assert.False(Succeeded);
            Assert.Equal("Invalid email or password", Result);
        }
    }
}
