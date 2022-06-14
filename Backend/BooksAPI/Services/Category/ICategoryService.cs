using BooksAPI.Models;

namespace BooksAPI.Services.Category
{
    public interface ICategoryService : ICommonService<CategoryModel>
    {
        Task<CategoryModel> GetByName(string name);
    }
}
