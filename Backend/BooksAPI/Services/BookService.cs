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

        public async Task<bool> Create(Book model)
        {
            _context.Books.Add(model);
            {
               
             

                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> Delete(Guid id)
        {
            var book =   await _context.Books.FindAsync(id);


         var result =   _context.Books.Remove(book);
     
             await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Book> Get(Guid id)
        {
    
                var book = await _context.Books.FindAsync(id);

                return book;
            
        }

        public async Task<List<Book>> GetAll()
        {
            var result = await _context.Books.ToListAsync();

            return result;
        }

        public async Task<bool> Update(Guid id, Book model)
        {
            _context.Entry(model).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
