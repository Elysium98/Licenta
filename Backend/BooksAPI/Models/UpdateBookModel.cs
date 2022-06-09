namespace BooksAPI.Models
{
    public class UpdateBookModel
    {
        public string ISBN { get; set; }

        public Guid Id { get; set; }

        public Guid CategoryId { get; set; }

        public string Title { get; set; }

        public string Author { get; set; }

        public string Publisher { get; set; }

        public DateTime PublicationDate { get; set; }

        public int Page { get; set; }

        public string Language { get; set; }

        public string Condition { get; set; }

        public bool isSold { get; set; }
    }
}
