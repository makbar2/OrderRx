
public interface IPatientMedicationService
{
    Task<IEnumerable<PatientMedication>> Get();
    Task<PatientMedication> GetById(int id);
    Task<PatientMedication> Add(PatientMedication patientMedication);
    Task<bool> Delete(int patientMedicationId);

    Task<List<PatientMedicationDto>> UpdateRecord(int patientId, List<PatientMedication> newMedList,  List<PatientMedication> oldMedlist );
    Task<bool> DeleteByIds(int patientId, int medicationId);

    Task<PatientMedication?> checkExists(PatientMedication patientMedication);//? why do i have this 

    Task<List<PatientMedicationDto>> getMedicationRelations(int medicationId);
    Task<List<PatientMedicationDto>> getPatientRelations(int patientId);
}

