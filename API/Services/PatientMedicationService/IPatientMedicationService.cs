
public interface IPatientMedicationService
{
    Task<IEnumerable<PatientMedication>> Get();
    Task<PatientMedication> GetById(int id);
    Task<PatientMedication> Add(PatientMedication patientMedication);
    Task<bool> Delete(int patientMedicationId);

    Task<bool> DeleteByIds(int patientId,int medicationId);

    Task<PatientMedication?> checkExists(PatientMedication patientMedication);
}

