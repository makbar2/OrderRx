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
        Patient patient = await _context.Patients.Include(p=> p.patientMedication).ThenInclude(pm=> pm.Medication).FirstOrDefaultAsync(p => p.Id == id);
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
    
   /// <summary>
   /// Only updates the patient's details 
   /// so first,surname,email,dob,phonenumber, address, post code
   /// </summary>
   /// <param name="patient"></param>
   /// <returns>patient object that was passed in</returns>
    public async Task<Patient> UpdateDetails(Patient patient)
    {
        var existingPatient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == gp.Id) ??
            throw new Exception($"Unable to find a patient to update");
        existingPatient.Name = patient.FirstName;
        existingPatient.Name = patient.Surname;
        existingPatient.Name = patient.DOB;
        existingPatient.Name = patient.Email;
        existingPatient.Name = patient.PhoneNumber;
        existingPatient.Name = patient.Address;
        existingPatient.Name = patient.Postcode;
        existingPatient.Address = patient.Address;
        await _context.SaveChangesAsync();
        return existingPatient;
    }
}