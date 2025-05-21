
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
        _context.User.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task Delete(User user)
    {
        _context.User.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task<List<User>> GetAll()
    {
        return await _context.User.ToListAsync();
    }

    public async Task<User> GetByEmail(string email)
    {
        var user = await _context.User.Where(
            u => u.Email.Contains(email)
        ).FirstOrDefaultAsync();
        if(user == null)
        {
            throw new Exception("User with the email " + email + " not found");
            }
        return user; 
    }

    public async Task<User> GetById(int id)
    {
        var user = await _context.User.FindAsync(id);
        if(user == null)
        {
            throw new KeyNotFoundException($"User with id {id} not found.");
        }
        return user;
    }

    public  async Task<User> GetByPhoneNumber(string phoneNumber)
        {
        var user = await _context.User.Where(
            u => u.Email.Contains(phoneNumber)
        ).FirstOrDefaultAsync();
        if(user == null)
            {
            throw new Exception("User with the phone number " + phoneNumber + " not found");
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
