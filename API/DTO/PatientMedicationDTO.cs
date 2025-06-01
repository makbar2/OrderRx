public class PatientMedicationDto
{
    public int PatientId { get; set; }
    public string FirstName { get; set; }
    public string Surname { get; set; }
    public DateTime DOB { get; set; }
    public Medication Medication { get; set; }
}