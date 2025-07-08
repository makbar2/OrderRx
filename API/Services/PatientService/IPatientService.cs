
public interface IPatientService
{
    Task<IEnumerable<PatientDto>> Get();
    Task<PatientDto> GetById(int id);
    Task<PatientDto> Add(Patient patient);
    Task<List<PatientDto>> GetBySurname(string surname);
        
    Task<List<PatientDto>> GetByDob(DateTime dob);

    Task<PatientDto> Update(Patient patient);

    Task<List<PatientDto>> getOrders(DateTime date);

    Task <PatientDto> updateDate(Patient patient);//just increments the dates on the patient by the frequency

    Task<List<PatientMedication>> GetMedications(int id);

    Task<bool> Delete(int id);
}

