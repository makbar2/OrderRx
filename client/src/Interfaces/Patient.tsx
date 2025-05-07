import GpPractice from "./GpPractice";
import Medication from "./Medication";
import PatientMedicationWrapper from "@/Interfaces/PatientMedicationWrapper"
export default interface Patient 
{
  id: number; // PK
  firstName: string;
  surname: string;
  dob: string; 
  address: string;
  postcode: string;
  notes?: string;
  gp?: GpPractice; 
  patientMedication?: Medication[] | PatientMedicationWrapper[];//cba
  collectionDate?: string; 
  orderDate?: string;
  orderFrequency: number; 
  active?: boolean;
}
