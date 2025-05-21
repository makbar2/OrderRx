
using Microsoft.EntityFrameworkCore;
public class UserService : IUserService
{   
    private readonly DataContext _context;
    public UserService(DataContext context)
    {
         _context = context;
    }
    public async Task<User> Create(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task Delete(User user)
    {
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task<List<User>> Get()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetByEmail(string email)
    {
        var user = await _context.Users.Where(
            u => u.Email.Contains(email)
        ).FirstOrDefaultAsync();
        return user; 
    }

    public async Task<User> GetById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if(user == null)
        {
            throw new KeyNotFoundException($"User with id {id} not found.");
        }
        return user;
    }

    public Task Login()
        {
        throw new NotImplementedException();
    }

    public Task Update(User user)
    {
        throw new NotImplementedException();
    }

}
