using BooksAPI.Models;
using BooksAPI.Services.Category;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BooksAPI.Controllers
{
    [ApiController]
    [Route("/categories")]
    public class CategoryController : ControllerBase
    {
        private ICategoryService _categoryService;

        public static IWebHostEnvironment _webHostEnviroment;

        public CategoryController(
            ICategoryService categoryService,
            IWebHostEnvironment webHostEnvironment
        )
        {
            _categoryService = categoryService;

            _webHostEnviroment = webHostEnvironment;
        }

        /// <summary>
        /// Gets all books
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                List<CategoryModel> categories = await _categoryService.GetAll();
                if (categories.Count == 0)
                {
                    return NoContent();
                }
                return Ok(categories);
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
        [HttpGet("{id}", Name = "GetCategoryById")]
        public async Task<IActionResult> GetCategoryById(Guid id)
        {
            try
            {
                CategoryModel foundCategory = await _categoryService.Get(id);
                if (foundCategory == null)
                {
                    return NotFound();
                }

                return Ok(foundCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Add a category
        /// </summary>
        /// <param name="category"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpPost()]
        public async Task<IActionResult> CreateCategory(CategoryModel category)
        {
            try
            {
                if (category == null)
                {
                    return BadRequest("Category cannot be null");
                }

                await _categoryService.Create(category);

                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Update the category
        /// </summary>
        /// <param name="id"></param>
        /// <param name="category"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CategoryModel category)
        {
            try
            {
                if (category == null)
                {
                    return BadRequest();
                }
                if (!await _categoryService.Update(id, category))
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
        /// Delete the category
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            try
            {
                if (!await _categoryService.Delete(id))
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
    }
}
