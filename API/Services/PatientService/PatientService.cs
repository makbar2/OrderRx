using Microsoft.EntityFrameworkCore;
using Mysqlx.Expr;
public class PatientService : IPatientService
{
    private readonly DataContext _context;

    public PatientService(DataContext context)
    {
        _context = context;
    }


    public async Task<PatientDto> Add(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
        var pdto = new PatientDto
        {
            Id = patient.Id,
            FirstName = patient.FirstName,
            Surname = patient.Surname,
            DOB = patient.DOB,
            Address = patient.Address,
            Postcode = patient.Postcode,
            Notes = patient.Notes,
            Gp = patient.Gp,
            Active = patient.Active,
            OrderDate = patient.OrderDate,
            CollectionDate = patient.CollectionDate,
            OrderFrequency = patient.OrderFrequency,
            Medications = patient.patientMedication != null
                ? patient.patientMedication.Select(pm => new Medication
                {
                    Id = pm.MedicationId,
                    Name = pm.Medication.Name
                }).ToList()
                : new List<Medication>()
        };
        return pdto;
    }

    public async Task<bool> Delete(int id)
    {
        var patient = await _context.Patients.FirstAsync(i => i.Id == id) ?? throw new Exception($"Unable to find a patient with the id : {id}");
        return true;
    }

    public async Task<IEnumerable<PatientDto>> Get()
    {
        List<PatientDto> patients = await _context.Patients.Select(p => new PatientDto
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
        }).ToListAsync() ?? throw new Exception("Unable to retrieve any patients check the database");
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

    public async Task<List<PatientDto>> GetBySurname(string surname)
    {
        List<PatientDto> patients = await _context.Patients.Where(p => p.Surname.StartsWith(surname, StringComparison.OrdinalIgnoreCase))
        .Select(p => new PatientDto
        {
            Id = p.Id,
            FirstName = p.FirstName,
            Surname = p.Surname,
            DOB = p.DOB,
            Address = p.Address,
            Postcode = p.Postcode,
        })
        .ToListAsync();
        if (!patients.Any())
        {
            throw new Exception("Patient not found with the surname : " + surname);
        }
        return patients;
    }

    public async Task<List<PatientDto>> GetByDob(DateTime dob)
    {
        List<PatientDto> patient = await _context.Patients.Where(p => p.DOB == DateOnly.FromDateTime(dob))
        .Select(p => new PatientDto
        {
            Id = p.Id,
            FirstName = p.FirstName,
            Surname = p.Surname,
            DOB = p.DOB,
            Address = p.Address,
            Postcode = p.Postcode,
        })
        .ToListAsync();
        if (!patient.Any())
        {
            throw new Exception("no patients found with the dob : " + dob);
        }
        return patient;
    }



    public async Task<PatientDto> Update(Patient updatedPatient)
    {

        Patient? existingPatient = await _context.Patients.FindAsync(updatedPatient.Id);
        if (existingPatient == null)
        {
            throw new Exception($"Patient not found with the id : {updatedPatient.Id}");
        }
        existingPatient.FirstName = updatedPatient.FirstName ?? existingPatient.FirstName;
        existingPatient.Surname = updatedPatient.Surname ?? existingPatient.Surname;
        existingPatient.Address = updatedPatient.Address ?? existingPatient.Address;
        existingPatient.Postcode = updatedPatient.Postcode ?? existingPatient.Postcode;
        existingPatient.Notes = updatedPatient.Notes ?? existingPatient.Notes;
        if (updatedPatient.DOB != default) existingPatient.DOB = updatedPatient.DOB;
        if (updatedPatient.GpPracticeId != 0) existingPatient.GpPracticeId = updatedPatient.GpPracticeId;
        if (updatedPatient.CollectionDate.HasValue) existingPatient.CollectionDate = updatedPatient.CollectionDate;
        if (updatedPatient.OrderDate.HasValue) existingPatient.OrderDate = updatedPatient.OrderDate;
        if (updatedPatient.OrderFrequency.HasValue) existingPatient.OrderFrequency = updatedPatient.OrderFrequency;
        if (updatedPatient.Active.HasValue) existingPatient.Active = updatedPatient.Active;
        _context.Patients.Update(existingPatient);
        await _context.SaveChangesAsync();
        var pdto = new PatientDto
        {
            Id = existingPatient.Id,
            FirstName = existingPatient.FirstName,
            Surname = existingPatient.Surname,
            DOB = existingPatient.DOB,
            Address = existingPatient.Address,
            Postcode = existingPatient.Postcode,
            Notes = existingPatient.Notes,
            Gp = existingPatient.Gp,
            Active = existingPatient.Active,
            OrderDate = existingPatient.OrderDate,
            CollectionDate = existingPatient.CollectionDate,
            OrderFrequency = existingPatient.OrderFrequency,
            Medications = existingPatient.patientMedication != null
                ? existingPatient.patientMedication.Select(pm => new Medication
                {
                    Id = pm.MedicationId,
                    Name = pm.Medication.Name
                }).ToList()
                : new List<Medication>()
        };
        return pdto;
    }

    public async Task<List<PatientDto>> getOrders(DateTime date)
    {
        var startOfWeek = date.Date.AddDays(-(int)date.DayOfWeek + (int)DayOfWeek.Monday);
        var endOfWeek = startOfWeek.AddDays(6).AddDays(1).AddTicks(-1);
        List<PatientDto> patients = await _context.Patients
        .Where(p => p.OrderDate >= startOfWeek && p.OrderDate <= endOfWeek)
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

        })
        .ToListAsync();
        return patients;
    }

    public async Task<PatientDto> updateDate(Patient patient)
    {
        if (patient.OrderDate.HasValue && patient.OrderFrequency.HasValue && patient.CollectionDate.HasValue)
        {
            int daysToAdd = patient.OrderFrequency.Value;
            patient.OrderDate = patient.OrderDate.Value.Date.AddDays(daysToAdd);
            patient.CollectionDate = patient.CollectionDate.Value.AddDays(daysToAdd);
            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
            var pdto = new PatientDto
            {
            Id = patient.Id,
            FirstName = patient.FirstName,
            Surname = patient.Surname,
            DOB = patient.DOB,
            Address = patient.Address,
            Postcode = patient.Postcode,
            Notes = patient.Notes,
            Gp = patient.Gp,
            Active = patient.Active,
            OrderDate = patient.OrderDate,
            CollectionDate = patient.CollectionDate,
            OrderFrequency = patient.OrderFrequency,
            Medications = patient.patientMedication != null
                ? patient.patientMedication.Select(pm => new Medication
                {
                    Id = pm.MedicationId,
                    Name = pm.Medication.Name
                }).ToList()
                : new List<Medication>()
            };
            return pdto;

        }
        else
        {
            throw new Exception($"patient {patient.Id} doesnt have a value set for either orderdate : {patient.OrderDate}, order frequency : {patient.OrderFrequency} or collection date : {patient.CollectionDate}");
        }
    }

    public async Task<List<PatientMedication>> GetMedications(int id)
    {
        var medications = await _context.Patients
            .Where(p => p.Id == id).Include(p => p.patientMedication).ThenInclude(pm => pm.Medication)
            .SelectMany(p => p.patientMedication)
            .ToListAsync();
        return medications;
    }

 


}