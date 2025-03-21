
namespace API.Services.PatientService
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> Get();
        Task<Patient> GetById(int id);
        Task<Patient> Add(Patient patient);
        Task<Patient> Update(Patient patient);
        Task<List<Patient>> GetBySurname(string surname);
        
        Task<List<Patient>> GetByDob(DateTime dob);

        Task<List<Patient>> GetRecent();

        Task<bool> Delete(int id);
    }

}