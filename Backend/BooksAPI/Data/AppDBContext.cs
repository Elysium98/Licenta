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

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

            base.OnModelCreating(modelBuilder);
            // modelBuilder.Entity<CategoryModel>()
            //.HasMany(c => c.Books)
            //.WithOne(e => e.Category)
            //.OnDelete(DeleteBehavior.ClientCascade);

        

            //modelBuilder.Entity<ApplicationUser>(e =>
            //{
            //    e.HasMany(p => p.Books)
            //    .WithOne(p => p.User)
            //    .HasForeignKey(p => p.UserId);  // inherited from IdentityUserLogin
            //});
        }
    }
}
