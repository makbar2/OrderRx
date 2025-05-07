using System.ComponentModel.DataAnnotations;
public class Patient
{
    public int Id { get; set; } // PK
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string Surname { get; set; }
     [Required]
    public DateOnly DOB { get; set; }
    [Required]
    public string Address {get; set;}
    [Required]
    public string Postcode {get; set;}
    public int GpPracticeId { get; set; } // FK to practice
    public string? Notes {get;set;}
    public GpPractice Gp {get;set;}

    public List<PatientMedication>? patientMedication {get;set;}

    public DateTime? CollectionDate {get ;set;}
    public DateTime? OrderDate {get ;set;}

    public int? OrderFrequency {get;set;}

    public bool? Active {get; set;}

}
