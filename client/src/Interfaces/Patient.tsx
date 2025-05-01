import GpPractice from "./GpPractice";
import Medication from "./Medication";
export default interface Patient 
{
  id: number; // PK
  firstName: string;
  surname: string;
  dob: string; // DateOnly in C# maps to a string (ISO 8601 format) in TypeScript
  address: string;
  postcode: string;
  notes?: string;
  gp?: GpPractice; // Assuming you have a corresponding GpPractice interface in TypeScript
  patientMedication?: Medication[];
  collectionDate?: string; // DateTime?, should be string or null
  orderDate?: string;// DateTime?, should be string or null
  orderFrequency: number; // Nullable number
  active?: boolean;
}
