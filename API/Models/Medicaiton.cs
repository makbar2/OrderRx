

using System.ComponentModel.DataAnnotations;

public class Medication{
    public int Id {get; set;}
    [Required]
    public string Name {get;set;}

}