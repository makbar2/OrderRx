import GpPractice from "./GpPractice";
import PatientMedication from "./PatientMedication";
export default interface Patient 
{
  id: number; // PK
  firstName: string | null; // Nullable, as FirstName can be null
  surname: string;
  dob: string; // DateOnly in C# maps to a string (ISO 8601 format) in TypeScript
  email: string;
  phoneNumber: string; // Default value in C# is "000-000-0000", but this will be handled in your app logic
  address: string;
  postcode: string;
  notes?: string | null; // Optional and nullable
  gp?: GpPractice; // Assuming you have a corresponding GpPractice interface in TypeScript
  patientMedication?: PatientMedication[] | null; // List of medications, nullable
  collectionDate?: string | null; // DateTime?, should be string or null
  orderDate?: string | null; // DateTime?, should be string or null
  orderFrequency?: number | null; // Nullable number
  active?: boolean | null; // Nullable boolean
}
