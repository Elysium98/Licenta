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
    public class BookRepository : BaseRepository<BookEntity>, IBookRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public BookRepository(ApplicationDBContext applicationDbContext)
            : base(applicationDbContext)
        {
            _dbContext = applicationDbContext;
        }
        public override async Task<IEnumerable<BookEntity>> GetAllAsync()
        {
            var result = await _dbContext.Books
                .Include(x => x.Category)
                .Include(y => y.User)
                .AsNoTracking()
                .ToListAsync();

            return result;
        }

        public async Task<List<BookEntity>> GetBooksByFilters(
            string? userId = null,
            bool? isSold = null,
            string? categoryName = null)
        {
            var query = _dbContext.Books
                .Include(x => x.Category)
                .Include(x => x.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(x => x.UserId == userId);
            }

            if (isSold.HasValue)
            {
                query = query.Where(x => x.isSold == isSold.Value);
            }

            if (!string.IsNullOrEmpty(categoryName))
            {
                query = query.Where(x => x.Category.Name == categoryName);
            }

            var result = await query.ToListAsync();

            return result;
        }
        public override async Task<BookEntity> GetByIdAsync(object id)
        {
            if (id == null) throw new ArgumentNullException(nameof(id));

            Guid guidId = id is Guid g
                          ? g
                          : Guid.TryParse(id.ToString(), out var parsed)
                            ? parsed
                            : throw new ArgumentException("Id must be a GUID or a valid string GUID", nameof(id));

            var book = await _dbContext.Books
                .Include(x => x.Category)
                .Include(x => x.User)
                .FirstOrDefaultAsync(b => b.Id == guidId);

            return book;
        }

        public override void Update(BookEntity entity)
        {
            var existing = _dbSet.Find(entity.Id);
            if (existing == null) return;

            existing.ISBN = entity.ISBN;
            existing.CategoryId = entity.CategoryId;
            existing.Title = entity.Title;
            existing.Author = entity.Author;
            existing.Publisher = entity.Publisher;
            existing.PublicationDate = entity.PublicationDate;
            existing.Page = entity.Page;
            existing.Price = entity.Price;
            existing.Language = entity.Language;
            existing.Condition = entity.Condition;
            existing.isSold = entity.isSold;
        }
    }
}
