using BooksAPI.Models;
using BooksAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace BooksAPI.Controllers
{
    [ApiController]
    [Route("/books")]
    public class BookController : ControllerBase
    {
        private IBookService _bookService;

        public static IWebHostEnvironment _webHostEnviroment;

        public BookController(IBookService bookService, IWebHostEnvironment webHostEnvironment)
        {
            _bookService = bookService;

            _webHostEnviroment = webHostEnvironment;
        }

    
        /// <summary>
        /// Gets all books
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            try
            {
                List<BookModel> books = await _bookService.GetAll();
                if (books.Count == 0)
                {
                    return NoContent();
                }
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Gets all books
        /// </summary>
        /// <returns></returns>
        [HttpGet("books/{status}")]
        public async Task<IActionResult> GetBooksByStatus(string status)
        {
            try
            {
                List<BookModel> books = await _bookService.GetAllByStatus(status);
                if (books.Count == 0)
                {
                    return NoContent();
                }
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Gets a book with a certain id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}", Name = "GetBookById")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            try
            {
                BookModel foundBook = await _bookService.Get(id);
                if (foundBook == null)
                {
                    return NotFound();
                }

                return Ok(foundBook);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Add a book
        /// </summary>
        /// <param name="book"></param>
        /// <returns></returns>
        //      [Authorize(Roles = "User")]
        [HttpPost()]
        public async Task<IActionResult> CreateBook(BookModel book)
        {
            try
            {
                if (book == null)
                {
                    return BadRequest("Book cannot be null");
                }

                await _bookService.Create(book);

                return Ok(book);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("saveFile")]
        public async Task<IActionResult> UploadPhoto()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();
                var file = formCollection.Files.First();
                var folderName = Path.Combine("Resources", "Images","Books");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue
                        .Parse(file.ContentDisposition)
                        .FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Update the book
        /// </summary>
        /// <param name="id"></param>
        /// <param name="book"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(Guid id, [FromBody] UpdateBookModel book)
        {
            try
            {
                if (book == null)
                {
                    return BadRequest();
                }
                if (!await _bookService.Update2(id, book))
                {
                    return NotFound();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        /// <summary>
        /// Update the book
        /// </summary>
        /// <param name="id"></param>
        /// <param name="book"></param>
        /// <returns></returns>
        [HttpPut("book/updatePhoto/{id}")]
        public async Task<IActionResult> UpdatePhoto(Guid id, [FromBody] ImageModel model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest();
                }
                if (!await _bookService.UpdatePhoto(id, model))
                {
                    return NotFound();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Delete the book
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(Guid id)
        {
            try
            {
                if (!await _bookService.Delete(id))
                {
                    return NotFound();
                }
                return Ok("Book deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
