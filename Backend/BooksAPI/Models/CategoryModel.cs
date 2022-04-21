using System.ComponentModel.DataAnnotations;

namespace BooksAPI.Models
{
    public class CategoryModel
    {
        [Key]
        public Guid CategoryId { get; set; }

        public string Name { get; set; }

        //  public ICollection<BookModel> Books { get; set; }
    }
}
