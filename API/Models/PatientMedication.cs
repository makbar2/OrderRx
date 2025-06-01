using System.Text.Json.Serialization;
public class PatientMedication 
{
    [JsonIgnore]
    public int Id {get; set;}
    [JsonIgnore]
    public int PatientId {get; set;}
    [JsonIgnore]
    public int MedicationId {get; set;}
    public Patient Patient { get; set; }
    public Medication Medication { get; set; }
}