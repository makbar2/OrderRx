using Microsoft.EntityFrameworkCore;
public class PatientMedicationService : IPatientMedicationService
{
    private readonly DataContext _context;

    public PatientMedicationService(DataContext context)
    {
        _context = context;
    }

    public async Task<PatientMedication> Add(PatientMedication patientMedication)
    {
        _context.PatientMedications.Add(patientMedication);
        await _context.SaveChangesAsync();
        return patientMedication;
    }

    public async Task<bool> Delete(int id)
    {
        var pm = await _context.PatientMedications.FirstAsync(i => i.Id == id) ?? throw new Exception($"Unable to find a patient with the id : {id}");
        return true;
    }

    public async Task<IEnumerable<PatientMedication>> Get()
    {
        List<PatientMedication> pms = await _context.PatientMedications.ToListAsync() ?? throw new Exception("Unable to retrieve any records from the patient medication join table check the database");
        return pms;
    }

    public async Task<PatientMedication> GetById(int id)
    {
        PatientMedication pm = await _context.PatientMedications
            .FirstOrDefaultAsync(i => i.Id == id) ?? throw new Exception($"Unable to find a patient medication with the id : {id}");
        return pm;
    }
    

    public async Task<PatientMedication?> checkExists(PatientMedication patientMedication)
    {
        return await _context.PatientMedications.FirstOrDefaultAsync(i => i.PatientId == patientMedication.PatientId && i.MedicationId == patientMedication.MedicationId);
    }
}
