namespace BooksAPI.ViewModels.DTO
{
    public class UserDTO
    {
        public UserDTO(
            string id,
            string fullName,
            string email,
            string userName,
            DateTime dateCreated,
            string role
        )
        {
            Id = id;
            FullName = fullName;
            Email = email;
            UserName = userName;
            DateCreated = dateCreated;
            Role = role;
        }

        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public DateTime DateCreated { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
    }
}
