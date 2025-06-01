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

    public async Task<bool> Delete(int patientMedicationId)
    {
        var pm = await _context.PatientMedications.FirstAsync(i => i.Id == patientMedicationId) ?? 
            throw new Exception($"Unable to find a relation  with the id of{patientMedicationId}");
        _context.PatientMedications.Remove(pm);
        await _context.SaveChangesAsync();
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

    public async Task<bool> DeleteByIds(int patientId, int medicationId)
    {
        var pm = await _context.PatientMedications.FirstAsync(i => i.PatientId == patientId && i.MedicationId == medicationId) ?? 
            throw new Exception($"Unable to find a relation between patient : {patientId} and medication : {medicationId}");
        _context.PatientMedications.Remove(pm);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<PatientMedicationDto>> getMedicationRelations(int medicationId)
    {
        var pms = await _context.PatientMedications
            .Where(i => i.MedicationId == medicationId)
            .Select(pm => new PatientMedicationDto
            {
                PatientId = pm.PatientId,
                FirstName = pm.Patient.FirstName,
                Surname = pm.Patient.Surname,
                DOB = pm.Patient.DOB.ToDateTime(TimeOnly.MinValue),//never using date only ever again
                
                Medication = pm.Medication
            })
            .ToListAsync();
        return pms;
        
    }
}
