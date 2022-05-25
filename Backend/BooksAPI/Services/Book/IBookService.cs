using BooksAPI.Models;

namespace BooksAPI.Services
{
    public interface IBookService : ICommonService<BookModel>
    {
        Task<bool> Update2(Guid id, UpdateBookModel model);

        Task<List<BookModel>> GetAllByUserAndStatus(string userId, bool isSold);

        Task<List<BookModel>> GetAllByStatus(bool isSold);

        Task<List<BookModel>> GetAllByCategory(string categoryName);

        Task<bool> UpdatePhoto(Guid id, ImageModel model);
    }
}
