using BooksAPI.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections;

namespace BooksAPI.Data.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
