using BooksAPI.Data.Entities;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BooksAPI.Models
{
    public class BookModel
    {
        public Guid Id { get; set; }

        // [KeyAttribute]
        // [ForeignKeyAttribute("User")]
       
        public string Title { get; set; }

        public string Author { get; set; }

        public string Publishing { get; set; }

        //       public DateTime PublicationDate { get; set; }
        public int Page { get; set; }

        //      public string ISBN { get; set; }
        public string Language { get; set; }

        public string Status { get; set; }

      
        public string Image { get; set; }

        public Guid CategoryId { get; set; }

        public CategoryModel? Category { get; set; }

        //[ForeignKey("User")]
        public string UserId { get; set; }

        public ApplicationUser? User { get; set; }
    }
}
