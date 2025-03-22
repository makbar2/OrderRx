using System.ComponentModel.DataAnnotations;
public class Patient
{
    public int Id { get; set; } // PK
    [Required]
    public string? FirstName { get; set; }
    [Required]
    public string Surname { get; set; }
     [Required]
    public DateOnly DOB { get; set; }
    [Required]//to allow a patient to have a seperate email to the user, if logged in it will default to the user's email
    public string Email {get;set;}
        
    [Required]
    public string PhoneNumber { get; set; } = "000-000-0000"; // Default value
    [Required]
    public string Address {get; set;}
    [Required]
    public string Postcode {get; set;}
    public int GpPracticeId { get; set; } // FK to practice
    public string Notes {get;set;}
    public GpPractice Gp {get;set;}


}
