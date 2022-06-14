using BooksAPI.Data;
using BooksAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;

namespace BooksAPI.Services
{
    public class BookService : IBookService
    {
        private readonly AppDBContext _context;

        public BookService(AppDBContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(BookModel model)
        {
            _context.Books.Add(model);
            {
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> Delete(Guid id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return false;
            }

            _context.Books.Remove(book);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<BookModel> Get(Guid id)
        {
            var book = await _context.Books
                .Include(x => x.Category)
                .Include(y => y.User)
                .FirstOrDefaultAsync(i => i.Id == id);

            return book;
        }

        public async Task<List<BookModel>> GetAll()
        {
            var result = await _context.Books
                .Include(x => x.Category)
                .Include(y => y.User)
                .ToListAsync();

            return result;
        }

        public async Task<List<BookModel>> GetAllByUserAndStatus(string userId, bool isSold)
        {
            var result = await _context.Books
                .Where(c => c.UserId == userId)
                .Where(x => x.isSold == isSold)
                .Include(x => x.Category)
                .Include(y => y.User)
                .ToListAsync();

            return result;
        }

        public async Task<List<BookModel>> GetAllByStatus(bool isSold)
        {
            var result = await _context.Books
                .Where(x => x.isSold == isSold)
                .Include(x => x.Category)
                .Include(y => y.User)
                .ToListAsync();

            return result;
        }

        public async Task<List<BookModel>> GetAllByCategory(string categoryName)
        {
            var result = await _context.Books
                .Where(c => c.Category.Name == categoryName)
                .Include(x => x.Category)
                .Include(y => y.User)
                .ToListAsync();

            return result;
        }

        public Task<bool> Update(Guid id, BookModel model)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateCertainProperties(Guid id, UpdateBookModel model)
        {
            if (model.Id == null)
            {
                return false;
            }
            var book = await _context.Books.FindAsync(id);

            book.ISBN = model.ISBN;
            book.CategoryId = model.CategoryId;
            book.Title = model.Title;
            book.Author = model.Author;
            book.Publisher = model.Publisher;
            book.PublicationDate = model.PublicationDate;
            book.Page = model.Page;
            book.Language = model.Language;
            book.Condition = model.Condition;
            book.isSold = model.isSold;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdatePhoto(Guid id, ImageModel model)
        {
            var book = await _context.Books.FindAsync(id);

            book.Image = model.Image;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
