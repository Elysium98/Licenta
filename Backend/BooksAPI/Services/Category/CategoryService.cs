using BooksAPI.Data;
using BooksAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BooksAPI.Services.Category
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDBContext _context;

        public CategoryService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(CategoryModel model)
        {
            _context.Categories.Add(model);
            {
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> Delete(Guid id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return false;
            }

            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<CategoryModel> Get(Guid id)
        {
            var category = await _context.Categories.FindAsync(id);

            return category;
        }

        public async Task<List<CategoryModel>> GetAll()
        {
            var result = await _context.Categories.ToListAsync();

            return result;
        }

        public async Task<bool> Update(Guid id, CategoryModel model)
        {
            if (model.CategoryId == null)
            {
                return false;
            }

            var category = await _context.Categories.FindAsync(id);

            category.Name = model.Name;
            // _context.Entry(model).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
