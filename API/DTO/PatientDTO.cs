public class PatientDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string Surname { get; set; }
    public DateOnly DOB { get; set; }
    public string Address { get; set; }
    public string Postcode { get; set; }
    public string? Notes { get; set; }
    public int? OrderFrequency {get;set;}
    public bool? Active {get; set;}
    public DateTime? CollectionDate {get ;set;}
    public DateTime? OrderDate {get ;set;}
    public GpPractice? Gp { get; set; } 
    public int GpPracticeId { get; set; }
    public List<Medication> Medications { get; set; }
}
