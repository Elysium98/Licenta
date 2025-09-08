using BooksApp.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BooksApp.Data.Interfaces
{
    public interface ICategoryRepository : IBaseRepository<CategoryEntity>
    {
        Task<CategoryEntity?> GetByNameAsync(string name);

    }
}
