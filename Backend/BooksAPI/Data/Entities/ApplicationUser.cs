using BooksAPI.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace BooksAPI.Data.Entities
{
    public class ApplicationUser : IdentityUser
    {
        // public string FullName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Study { get; set; }

        public string Image { get; set; }

        public string City { get; set; }

       public DateTime BirthDate { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }
    }
}
