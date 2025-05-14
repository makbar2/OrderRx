using Microsoft.EntityFrameworkCore;
public class PatientService : IPatientService
{
    private readonly DataContext _context;

    public PatientService(DataContext context)
    {
        _context = context;
    }


    public async Task<Patient> Add(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
        return patient;
    }

    public async Task<bool> Delete(int id)
    {
        var patient = await _context.Patients.FirstAsync(i => i.Id == id) ?? throw new Exception($"Unable to find a patient with the id : {id}");
        return true;
    }

    public async Task<IEnumerable<Patient>> Get()
    {
        List<Patient> patients = await _context.Patients.ToListAsync() ?? throw new Exception("Unable to retrieve any patients check the database");
        return patients;
    }

    public async Task<Patient> GetById(int id)
    {
        //Patient patient = await _context.Patients.Include(p=> p.patientMedication).FirstOrDefaultAsync(p => p.Id == id);
        Patient patient = await _context.Patients
        .Include(p => p.Gp)
        .Include(p=> p.patientMedication).ThenInclude(pm=> pm.Medication)
        .FirstOrDefaultAsync(p => p.Id == id);
        //Patient patient = await _context.Patient.FindAsync(id);
        if(patient == null)
        {
            throw new Exception("Patient not found with the id : "+id);
        }
        return patient;
    }

    public async Task<List<Patient>> GetBySurname(string surname)
    {
        List<Patient> patient = await _context.Patients.Where(p => p.Surname.StartsWith(surname,StringComparison.OrdinalIgnoreCase)).ToListAsync();
        if (!patient.Any())
        {
            throw new Exception("Patient not found with the surname : "+surname);
        }
        return patient;
    }

    public async Task<List<Patient>> GetByDob(DateTime dob)
    {
        List<Patient> patient = await _context.Patients.Where(p => p.DOB == DateOnly.FromDateTime(dob)).ToListAsync();
        if (!patient.Any())
        {
            throw new Exception("no patients found with the dob : "+ dob);
        }
        return patient;
    }
    
  

    public async Task<Patient> Update(Patient patient)
    {
        _context.Patients.Update(patient);
        await _context.SaveChangesAsync();
        return patient;
    }

    public async  Task<List<Patient>> getOrders(DateTime date)
    {
        var startOfWeek = date.Date.AddDays(-(int)date.DayOfWeek + (int)DayOfWeek.Monday);
        var endOfWeek = startOfWeek.AddDays(6).AddDays(1).AddTicks(-1); 
       List<Patient> patients = await _context.Patients
        .Where(p => p.OrderDate >= startOfWeek && p.OrderDate <= endOfWeek)
        .ToListAsync();
        return patients;
    }

    public async Task<List<PatientMedication>> GetMedications(int id)
    {
        var medications = await _context.Patients
            .Where(p => p.Id == id).Include(p=> p.patientMedication).ThenInclude(pm=> pm.Medication)
            .SelectMany(p => p.patientMedication)
            .ToListAsync();
        return medications;
    }

}