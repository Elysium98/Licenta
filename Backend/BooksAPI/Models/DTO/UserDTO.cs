namespace BooksAPI.ViewModels.DTO
{
    public class UserDTO
    {
        public UserDTO(
            string id,
            string firstName,
            string lastName,
            string study,
            string image,
            string city,
            DateTime birthDate,
            string phoneNumber,
            string email,
            string userName,
            DateTime dateCreated,
            string role
        )
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Study = study;
            Image = image;
            City = city;
            BirthDate = birthDate;
            PhoneNumber = phoneNumber;
            Email = email;
            UserName = userName;
            DateCreated = dateCreated;
            Role = role;
        }

        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Study { get; set; }
        public string Image { get; set; }
        public string City { get; set; }
        public DateTime BirthDate { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public DateTime DateCreated { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
    }
}
