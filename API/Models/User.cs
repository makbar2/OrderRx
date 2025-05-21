using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class User 
{      
    public int Id { get; set; } // PK
        
    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
    

}   
