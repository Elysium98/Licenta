using BooksAPI.Data.Entities;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace BooksAPI.Models
{
    public class Book
    {
        public Guid Id { get; set; }


        [ForeignKeyAttribute("User")]
        public Guid UserId { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Publishing { get; set; }

        //       public DateTime PublicationDate { get; set; }
        public int Page { get; set; }

        //      public string ISBN { get; set; }
        public string Language { get; set; }
        public string Status { get; set; }
       public IFormFile Image { get; set; }
        public string Category { get; set; }
    }
}
