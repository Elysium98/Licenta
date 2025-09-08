using BooksApp.Services.Interfaces;
using BooksApp.Services.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BooksApp.API.Controllers
{
    [Route("/books")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<IActionResult> GetBooks([FromQuery] string? userId, [FromQuery] bool? isSold, [FromQuery] string? categoryName)
        {
            if (userId == null && isSold == null && categoryName == null)
            {
                var allBooks = await _bookService.GetAllAsync();
                return Ok(allBooks);
            }
            else
            {
                var filteredBooks = await _bookService.GetBooksByFilters(userId, isSold, categoryName);
                if (filteredBooks.Count == 0)
                    return NoContent();
                return Ok(filteredBooks);
            }
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<BookModel>> GetById(string id)
        {
            var book = await _bookService.GetByIdAsync(id);
            if (book == null)
                return NotFound();

            return Ok(book);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        public async Task<ActionResult<BookModel>> Create([FromBody] BookModel bookModel)
        {
            var created = await _bookService.CreateAsync(bookModel);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] BookModel bookModel)
        {
            var existing = await _bookService.GetByIdAsync(bookModel.Id.ToString());
            if (existing == null)
                return NotFound();

            await _bookService.UpdateAsync(bookModel);
            return Ok(bookModel);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _bookService.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _bookService.DeleteAsync(id);
            return NoContent();
        }
    }
}
