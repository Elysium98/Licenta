using BooksAPI.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BooksAPI.Data
{
    public class AppDBContext : IdentityDbContext<User, IdentityRole, string>
    {
        public AppDBContext(DbContextOptions options) : base(options) { }
    }
}
