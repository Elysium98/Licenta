using BooksAPI.Data.Entities;
using BooksAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BooksAPI.Data
{
    public class AppDBContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
    {
        public AppDBContext(DbContextOptions options) : base(options) { }

        public DbSet<BookModel> Books { get; set; }

        public DbSet<CategoryModel> Categories { get; set; }
    }
}
