import Medication from "./Medication";
import Patient from "./Patient";

export default interface PatientMedication
{
    Id: number,
    patient : Patient,
    medication : Medication
}
//not including the patientId, and MedId field in this interface because its redundant