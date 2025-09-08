using AutoMapper;
using BooksApp.Data.Entities;
using BooksApp.Data.Interfaces;
using BooksApp.Services.Implementation;
using BooksApp.Services.Models;
using Moq;

namespace BooksApp.Tests.Unit
{
    public class BookTests
    {
        private readonly Mock<IBookRepository> _bookRepositoryMock;
        private readonly BookService _bookService;
        private readonly IMapper _mapper;
        public BookTests()
        {
            _bookRepositoryMock = new Mock<IBookRepository>();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<BookEntity, BookModel>().ReverseMap();
            });
            _mapper = config.CreateMapper();

            _bookService = new BookService(_bookRepositoryMock.Object, _mapper);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnBook_WhenBookExists()
        {
            // Arrange
            var bookId = Guid.NewGuid();
            var entity = new BookEntity { Id = bookId, Title = "Test Book" };

            // Setup mock
            _bookRepositoryMock
                .Setup(r => r.GetByIdAsync(It.Is<object>(id => id.ToString() == bookId.ToString())))
                .ReturnsAsync(entity);

            // Act
            var result = await _bookService.GetByIdAsync(bookId.ToString());

            // Assert
            Assert.NotNull(result);
            Assert.Equal(bookId.ToString(), result.Id); 
            Assert.Equal("Test Book", result.Title);
        }


        [Fact]
        public async Task GetAllAsync_ShouldReturnMappedBooks()
        {
            // Arrange
            var entities = new List<BookEntity>
        {
            new BookEntity { Id =  Guid.NewGuid(), Title = "Book 1" },
            new BookEntity { Id =  Guid.NewGuid(), Title = "Book 2" }
        };
            _bookRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(entities);

            // Act
            var result = await _bookService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, b => b.Title == "Book 1");
        }

        [Fact]
        public async Task GetBooksByFilters_ShouldReturnFilteredBooks()
        {
            // Arrange
            var entities = new List<BookEntity>
        {
            new BookEntity { Id =  Guid.NewGuid(), Title = "Book A", UserId = "u1", isSold = false },
            new BookEntity { Id =  Guid.NewGuid(), Title = "Book B", UserId = "u2", isSold = true }
        };
            _bookRepositoryMock
                .Setup(r => r.GetBooksByFilters("u1", false, null))
                .ReturnsAsync(entities.Where(e => e.UserId == "u1" && e.isSold == false).ToList());

            // Act
            var result = await _bookService.GetBooksByFilters("u1", false, null);

            // Assert
            Assert.Single(result);
            Assert.Equal("Book A", result.First().Title);
        }

        [Fact]
        public async Task CreateAsync_ShouldAddBook_AndReturnMappedBook()
        {
            // Arrange
            var bookId = Guid.NewGuid();
            var model = new BookModel { Id = bookId.ToString(), Title = "New Book" };

            _bookRepositoryMock
                .Setup(r => r.CreateAsync(It.IsAny<BookEntity>()))
                .Returns(Task.CompletedTask);

            _bookRepositoryMock
                .Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(1);

            // Act
            var result = await _bookService.CreateAsync(model);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("New Book", result.Title);
            Assert.Equal(bookId.ToString(), result.Id);
            _bookRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<BookEntity>()), Times.Once);
            _bookRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateBook()
        {
            // Arrange
            var bookId = Guid.NewGuid();
            var model = new BookModel { Id = bookId.ToString(), Title = "Updated Book" };

            _bookRepositoryMock
                .Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(1);

            // Act
            await _bookService.UpdateAsync(model);

            // Assert
            _bookRepositoryMock.Verify(r => r.Update(It.IsAny<BookEntity>()), Times.Once);
            _bookRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }


        [Fact]
        public async Task DeleteAsync_ShouldRemoveBook_WhenBookExists()
        {
            // Arrange
            var bookId = Guid.NewGuid();
            var entity = new BookEntity { Id = bookId, Title = "Book to Delete" };

            // Setup mock
            _bookRepositoryMock
                .Setup(r => r.GetByIdAsync(It.Is<object>(id => id.ToString() == bookId.ToString())))
                .ReturnsAsync(entity);

            _bookRepositoryMock
                .Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(1);

            // Act
            await _bookService.DeleteAsync(bookId.ToString()); 

            // Assert
            _bookRepositoryMock.Verify(r => r.Delete(entity), Times.Once);
            _bookRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_ShouldDoNothing_WhenBookNotFound()
        {
            // Arrange
            _bookRepositoryMock.Setup(r => r.GetByIdAsync("99")).ReturnsAsync((BookEntity)null);

            // Act
            await _bookService.DeleteAsync("99");

            // Assert
            _bookRepositoryMock.Verify(r => r.Delete(It.IsAny<BookEntity>()), Times.Never);
            _bookRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
    }
}
