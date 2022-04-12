namespace BooksAPI.Services
{
    public interface ICommonService<T>
    {
        Task<List<T>> GetAll();

        Task<T> Get(Guid id);

        Task<bool> Create(T model);

        Task<bool> Update(Guid id, T model);

        Task<bool> Delete(Guid id);
    }
}
