
public interface IMedicationService
{
    Task<IEnumerable<Medication>> Get();
    Task<Medication> GetById(int id);
    Task<Medication> Add(Medication medication);
    Task<Medication> Update(Medication medication);
    Task<List<Medication>> GetByName(string name);
    Task<bool> Delete(int id);
}

