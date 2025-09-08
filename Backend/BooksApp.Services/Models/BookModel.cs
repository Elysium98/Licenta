namespace BooksApp.Services.Models
{
    public class BookModel
    {
        public string? Id { get; set; }
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
        public string? CategoryId { get; set; }
        public CategoryModel? Category { get; set; }
        public string? UserId { get; set; }
        public UserModel? User { get; set; }
    }
}
