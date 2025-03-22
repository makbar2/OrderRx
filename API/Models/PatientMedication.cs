public class PatientMedication 
{
    public int Id {get; set;}
    public int PatientId {get; set;}
    public int MedicationId {get; set;}
    public Patient Patient;
    public Medication Medication;
}