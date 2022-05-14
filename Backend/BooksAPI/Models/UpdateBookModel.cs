namespace BooksAPI.Models
{
    public class UpdateBookModel
    {

        public Guid Id { get; set; }
        public string Title { get; set; }

        public string Author { get; set; }

        public string Publishing { get; set; }

        //       public DateTime PublicationDate { get; set; }
        public int Page { get; set; }

        //      public string ISBN { get; set; }
        public string Language { get; set; }

        public string Status { get; set; }


    }
}
