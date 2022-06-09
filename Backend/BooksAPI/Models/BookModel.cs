using BooksAPI.Data.Entities;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BooksAPI.Models
{
    public class BookModel
    {
        public Guid Id { get; set; }

        public string ISBN { get; set; }
        public string Title { get; set; }

        public string Author { get; set; }

        public string Publisher { get; set; }

        public DateTime PublicationDate { get; set; }
        public int Page { get; set; }

        public int Price { get; set; }

        public string Language { get; set; }

        public string Condition { get; set; }

        public bool isSold { get; set; }
        public string Image { get; set; }

        public Guid CategoryId { get; set; }

        public CategoryModel? Category { get; set; }

        public string UserId { get; set; }

        public ApplicationUser? User { get; set; }
    }
}
