using BooksAPI.Models;

namespace BooksAPI.Services
{
    public interface IBookService : ICommonService<BookModel> {

        Task<bool> Update2(Guid id, UpdateBookModel model);


        //Task<List<BookModel>> GetAllv2(string status);

        Task<List<BookModel>> GetAllByStatus(string status);
        Task<bool> UpdatePhoto(Guid id, ImageModel model);
    }
}
