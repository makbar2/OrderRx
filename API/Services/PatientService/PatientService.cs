// using Microsoft.EntityFrameworkCore;

// namespace API.Services.PatientService;
// public class PatientService : IPatientService
// {
//     private readonly DataContext _context;

//     public PatientService(DataContext context)
//     {
//         _context = context;
//     }


//     public async Task<Patient> Add(Patient patient)
//     {
//         _context.Patient.Add(patient);
//         await _context.SaveChangesAsync();
//         return patient;
//     }

//     public Task<bool> Delete(int id)
//     {
//         throw new NotImplementedException();
//     }

//     public Task<IEnumerable<Patient>> Get()
//     {
//         throw new NotImplementedException();
//     }

//     public async Task<Patient> GetById(int id)
//     {
//         Patient patient = await _context.Patient.Include(p=> p.VaccinesApplied).ThenInclude(v => v.Vaccine).FirstOrDefaultAsync(p => p.Id == id);
//         //Patient patient = await _context.Patient.FindAsync(id);
//         if(patient == null)
//         {
//             throw new Exception("Patient not found with the id : "+id);
//         }
//         return patient;
//     }

//     public async Task<List<Patient>> GetBySurname(string surname)
//     {
//         List<Patient> patient = await _context.Patient.Where(p => p.Surname.StartsWith(surname,StringComparison.OrdinalIgnoreCase)).ToListAsync();
//         if (!patient.Any())
//         {
//             throw new Exception("Patient not found with the surname : "+surname);
//         }
//         return patient;
//     }

//     public async Task<List<Patient>> GetByDob(DateTime dob)
//     {
//         List<Patient> patient = await _context.Patient.Where(p => p.DOB == DateOnly.FromDateTime(dob)).ToListAsync();
//         if (!patient.Any())
//         {
//             throw new Exception("no patients found with the dob : "+ dob);
//         }
//         return patient;
//     }
    
//     public async Task<List<Patient>> GetRecent(){
        
//        List<Patient> patients = await _context.Patient.OrderByDescending(p=> p.CreatedDateTime).Take(25).ToListAsync();
//         if (!patients.Any())
//         {
//             throw new Exception("No patients were able to be retrieved, please check the database.");
//         }
//         return patients;
//     }



//     public Task<Patient> Update(Patient patient)
//     {
//         throw new NotImplementedException();
//     }
// }