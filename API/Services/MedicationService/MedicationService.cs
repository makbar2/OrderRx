
using Microsoft.EntityFrameworkCore;

public class MedicationService :IMedicationService 
{
    private readonly DataContext _context;

    public MedicationService(DataContext context)
    {
        _context = context;
    }

    public async Task<Medication> Add(Medication medication)
    {
        _context.Medications.Add(medication);
        await _context.SaveChangesAsync();
        return medication;
    }

    public async Task<bool> Delete(int id)
    {
        var medication = await _context.Medications.FirstAsync(i => i.Id == id) ?? throw new Exception($"Unable to find a medication with the id : {id}");
        _context.Medications.Remove(medication);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Medication>> Get()
    {        
        List<Medication> meds = await _context.Medications.ToListAsync() ?? throw new Exception("Unable to retrieve any medications check the database");
        return meds;
    }

    public async Task<Medication> GetById(int id)
    {
        var medication = await _context.Medications.FirstAsync(i => i.Id == id) ?? throw new Exception($"Unable to find a medication with the id : {id}");
        return medication;
    }

    public async Task<List<Medication>> GetByName(string name)
    {
        List<Medication> medications = await _context.Medications.Where(i => i.Name.StartsWith(name,StringComparison.OrdinalIgnoreCase)).ToListAsync() ?? 
            throw new Exception($"Unable to find meds with a name similar to  : {name}");
        return medications;
    }

    public async Task<Medication> Update(Medication medication)
    {
        var existingMedication = await _context.Medications.FirstOrDefaultAsync(p => p.Id == medication.Id) ??
            throw new Exception($"Unable to find a medication to update");
        existingMedication.Name = medication.Name;
        await _context.SaveChangesAsync();
        return existingMedication;
    }
}