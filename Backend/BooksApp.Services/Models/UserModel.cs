namespace BooksApp.Services.Models
{
    public class UserModel
    {
        public string? Id { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string City { get; set; }

        public DateTime BirthDate { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Image { get; set; }

        public string Role { get; set; }
    }
}
