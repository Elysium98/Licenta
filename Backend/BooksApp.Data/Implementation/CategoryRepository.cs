using BooksApp.Data.Entities;
using BooksApp.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BooksApp.Data.Implementation
{
    public class CategoryRepository : BaseRepository<CategoryEntity>, ICategoryRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public CategoryRepository(ApplicationDBContext applicationDbContext)
            : base(applicationDbContext)
        {
            _dbContext = applicationDbContext;
        }

        public async Task<CategoryEntity?> GetByNameAsync(string name)
        {
            return await _dbContext.Categories.FirstOrDefaultAsync(c => c.Name == name);
        }

        public override async Task<CategoryEntity> GetByIdAsync(object id)
        {
            if (id == null) throw new ArgumentNullException(nameof(id));

            Guid guidId = id is Guid g
                          ? g
                          : Guid.TryParse(id.ToString(), out var parsed)
                            ? parsed
                            : throw new ArgumentException("Id must be a GUID or a valid string GUID", nameof(id));

            var category = await _dbContext.Categories
                .FirstOrDefaultAsync(b => b.CategoryId == guidId);

            return category;
        }
    }
}
