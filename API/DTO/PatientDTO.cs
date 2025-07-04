public class PatientDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string Surname { get; set; }
    public DateOnly DOB { get; set; }
    public string Address { get; set; }
    public string Postcode { get; set; }
    public string? Notes { get; set; }
    public GpPractice? Gp { get; set; } // assuming Gp.Name exists
    public List<Medication> Medications { get; set; }
}
