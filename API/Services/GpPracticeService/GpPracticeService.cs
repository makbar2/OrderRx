using Microsoft.EntityFrameworkCore;
public class GpPracticeService : IGpPracticeService
{
    private readonly DataContext _context;

    public GpPracticeService(DataContext context)
    {
        _context = context;
    }

    public async Task<GpPractice> Add(GpPractice gp)
    {
        _context.GpPractices.Add(gp);
        await _context.SaveChangesAsync();
        return gp;
    }

    public async Task<bool> Delete(int id)
    {   
        GpPractice gp = await _context.GpPractices.FirstAsync(i => i.Id == id) ?? throw new Exception($"Unable to find a gp with the id : {id}");
        _context.GpPractices.Remove(gp);
        await _context.SaveChangesAsync();
        return true;
    }

    public async  Task<IEnumerable<GpPractice>> Get()
    {
        List<GpPractice> practices = await _context.GpPractices.ToListAsync() ?? throw new Exception("unable to retrieve any gp practices");
        return practices;
    }

    public async Task<GpPractice> GetById(int id)
    {
        GpPractice gp = await _context.GpPractices.FirstAsync(i => i.Id == id) ?? throw new Exception($"Unable to find a gp with the id : {id}");
        return gp;
    }

    public async Task<List<GpPractice>> GetByName(string name)
    {
        List<GpPractice> practices = await _context.GpPractices.Where(i => i.Name.StartsWith(name,StringComparison.OrdinalIgnoreCase)).ToListAsync() ?? 
            throw new Exception($"Unable to find a gp with a name similar to  : {name}");
        return practices;
    }

    public async Task<GpPractice> Update(GpPractice gp)
    {
        var existingGpPractice = await _context.GpPractices.FirstOrDefaultAsync(p => p.Id == gp.Id) ??
            throw new Exception($"Unable to find a gp to update");
        existingGpPractice.Name = gp.Name;
        existingGpPractice.Address = gp.Address;
        existingGpPractice.Email = gp.Email;
        await _context.SaveChangesAsync();
        return existingGpPractice;
    }
}