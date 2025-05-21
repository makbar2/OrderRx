


public interface IUserService
{
    public Task<List<User>> Get();
    public Task <User> GetById(int id);
    public Task <User?> GetByEmail(string email);
    public Task <User> Create(User user);
    public Task Delete(User user);
    public Task Update(User user);

    public Task Login();
    
}