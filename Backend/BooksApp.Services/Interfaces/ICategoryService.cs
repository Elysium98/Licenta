using BooksApp.Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BooksApp.Services.Interfaces
{
    public interface ICategoryService : IBaseService<CategoryModel, string>
    {
        Task<CategoryModel?> GetByName(string name);
    }
}
