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
            var book = await _context.Books.FindAsync(id);

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

        public async Task<bool> Update(Guid id, BookModel model)
        {
            if (model.Id == null)
            {
                return false;
            }
            _context.Entry(model).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
