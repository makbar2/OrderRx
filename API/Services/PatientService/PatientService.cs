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

    public async Task<PatientDto> GetById(int id)
    {
        //Patient patient = await _context.Patients.Include(p=> p.patientMedication).FirstOrDefaultAsync(p => p.Id == id);
        // Patient patient = await _context.Patients
        // .Include(p => p.Gp)
        // .Include(p=> p.patientMedication).ThenInclude(pm=> pm.Medication)
        // .FirstOrDefaultAsync(p => p.Id == id);
        PatientDto? patient = await _context.Patients.Where(p => p.Id == id)
        .Select(p => new PatientDto
        {
            Id = p.Id,
            FirstName = p.FirstName,
            Surname = p.Surname,
            DOB = p.DOB,
            Address = p.Address,
            Postcode = p.Postcode,
            Notes = p.Notes,
            Gp = p.Gp,
            Active = p.Active,
            OrderDate = p.OrderDate,
            CollectionDate = p.CollectionDate,
            OrderFrequency = p.OrderFrequency,
            Medications = p.patientMedication != null
                ? p.patientMedication.Select(pm => new Medication
                {
                    Id = pm.MedicationId,
                    Name = pm.Medication.Name
                }).ToList()
                : new List<Medication>()
                //if the user has no medications in their record then create an empty list
        }).FirstOrDefaultAsync();
        //Patient patient = await _context.Patient.FindAsync(id);
        if (patient == null)
        {
            throw new Exception("Patient not found with the id : " + id);
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

    public async Task <Patient> updateDate(Patient patient)
    {
        if(patient.OrderDate.HasValue && patient.OrderFrequency.HasValue && patient.CollectionDate.HasValue )
        {
            int daysToAdd = patient.OrderFrequency.Value;
            patient.OrderDate = patient.OrderDate.Value.Date.AddDays(daysToAdd);
            patient.CollectionDate = patient.CollectionDate.Value.AddDays(daysToAdd);
            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
            return patient;

        }else{
            throw new Exception($"patient {patient.Id} doesnt have a value set for either orderdate : {patient.OrderDate}, order frequency : {patient.OrderFrequency} or collection date : {patient.CollectionDate}" );
        }
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