
public interface IPatientService
{
    Task<IEnumerable<Patient>> Get();
    Task<Patient> GetById(int id);
    Task<Patient> Add(Patient patient);
    Task<List<Patient>> GetBySurname(string surname);
        
    Task<List<Patient>> GetByDob(DateTime dob);

    Task<Patient> Update(Patient patient);

    Task<bool> Delete(int id);
}

