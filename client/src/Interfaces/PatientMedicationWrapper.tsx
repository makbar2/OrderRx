/**
 * this is for the backend because the api expects stuff to be like this :
 * "patientMedication": [
        { "Medication": { "Id": 10 } },
        { "Medication": { "Id": 29 } }
    ]
    patient detaisl arnt included due to the json ignore that is in the models for the api

 */
import Medication from "./Medication";
export default interface PatientMedicationWrapper 
{
  Medication: Medication;
}
