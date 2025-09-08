using AutoMapper;
using BooksApp.Data.Entities;
using BooksApp.Data.Interfaces;
using BooksApp.Services.Implementation;
using BooksApp.Services.Models;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BooksApp.Tests.Unit
{
    public class CategoryTests
    {
        private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
        private readonly CategoryService _categoryService;
        private readonly IMapper _mapper;

        public CategoryTests()
        {
            _categoryRepositoryMock = new Mock<ICategoryRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<CategoryEntity, CategoryModel>()
                    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CategoryId.ToString()))
                    .ReverseMap()
                    .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => Guid.Parse(src.Id)));
            });
            _mapper = config.CreateMapper();

            _categoryService = new CategoryService(_categoryRepositoryMock.Object, _mapper);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnCategory_WhenCategoryExists()
        {
            // Arrange
            var categoryId = Guid.NewGuid();
            var entity = new CategoryEntity { CategoryId = categoryId, Name = "Test Category" };

            // Setup mock
            _categoryRepositoryMock
                .Setup(r => r.GetByIdAsync(It.Is<object>(id => id.ToString() == categoryId.ToString())))
                .ReturnsAsync(entity);

            // Act
            var result = await _categoryService.GetByIdAsync(categoryId.ToString());

            // Assert
            Assert.NotNull(result);
            Assert.Equal(categoryId.ToString(), result.Id);
            Assert.Equal("Test Category", result.Name);
        }


        [Fact]
        public async Task GetByName_ShouldReturnCategory_WhenCategoryExists()
        {
            // Arrange
            var categoryId = Guid.NewGuid();
            var entity = new CategoryEntity { CategoryId = categoryId, Name = "Electronics" };
            _categoryRepositoryMock.Setup(r => r.GetByNameAsync("Electronics")).ReturnsAsync(entity);

            // Act
            var result = await _categoryService.GetByName("Electronics");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(categoryId.ToString(), result.Id);
            Assert.Equal("Electronics", result.Name);
        }


        [Fact]
        public async Task GetAllAsync_ShouldReturnMappedCategories()
        {
            // Arrange
            var entities = new List<CategoryEntity>
            {
                new CategoryEntity { CategoryId = Guid.NewGuid(), Name = "Category 1" },
                new CategoryEntity { CategoryId = Guid.NewGuid(), Name = "Category 2" }
            };
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(entities);

            // Act
            var result = await _categoryService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, c => c.Name == "Category 1");
        }

        [Fact]
        public async Task CreateAsync_ShouldAddCategory_AndReturnMappedCategory()
        {
            // Arrange
            var model = new CategoryModel { Id = Guid.NewGuid().ToString(), Name = "New Category" };
            _categoryRepositoryMock.Setup(r => r.CreateAsync(It.IsAny<CategoryEntity>())).Returns(Task.CompletedTask);
            _categoryRepositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            var result = await _categoryService.CreateAsync(model);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("New Category", result.Name);
            _categoryRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<CategoryEntity>()), Times.Once);
            _categoryRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateCategory()
        {
            // Arrange
            var model = new CategoryModel { Id = Guid.NewGuid().ToString(), Name = "Updated Category" };
            _categoryRepositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            await _categoryService.UpdateAsync(model);

            // Assert
            _categoryRepositoryMock.Verify(r => r.Update(It.IsAny<CategoryEntity>()), Times.Once);
            _categoryRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveCategory_WhenCategoryExists()
        {
            // Arrange
            var categoryId = Guid.NewGuid();
            var entity = new CategoryEntity { CategoryId = categoryId, Name = "Category to Delete" };

            _categoryRepositoryMock
                .Setup(r => r.GetByIdAsync(It.Is<object>(id => id.ToString() == categoryId.ToString())))
                .ReturnsAsync(entity);

            _categoryRepositoryMock
                .Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(1);

            // Act
            await _categoryService.DeleteAsync(categoryId.ToString());

            // Assert
            _categoryRepositoryMock.Verify(r => r.Delete(entity), Times.Once);
            _categoryRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }


        [Fact]
        public async Task DeleteAsync_ShouldDoNothing_WhenCategoryNotFound()
        {
            // Arrange
            _categoryRepositoryMock.Setup(r => r.GetByIdAsync("99")).ReturnsAsync((CategoryEntity)null);

            // Act
            await _categoryService.DeleteAsync("99");

            // Assert
            _categoryRepositoryMock.Verify(r => r.Delete(It.IsAny<CategoryEntity>()), Times.Never);
            _categoryRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
    }
}
