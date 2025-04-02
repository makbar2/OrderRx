//assuming i would need more functions in here
import Patient from "@/Interfaces/Patient";
import GpPractice from "@/Interfaces/GpPractice";
import Medication from "@/Interfaces/Medication";
function formatPatient(data:any): Patient
{
    const patient: Patient = {
        id: data.id,
        firstName : data.firstName, 
        surname : data.surname, 
        postcode : data.postcode,
        dob : data.dob,
        email : data.email, 
        phoneNumber : data.phoneNumber,
        address : data.address, 
        notes: data.notes,
        gp : formatGP(data.gp),
        patientMedication : formatPatientMedications(data.patientMedication),
        collectionDate : data.collectionDate, 
        orderDate : data.orderDate,
        orderFrequency : data.orderFrequency,
        active: data.active
    };
    return patient;
} 

function formatGP(data:any): GpPractice | undefined
{
    if(data != null)
    {
        const gp : GpPractice = {
            id : data.id,
            name : data.name,
            address : data.address
        }
        return gp;
    }
    return undefined;
}


/**
 * this is for medications that were retrived from the get patient endpoint only, this function isnt 
 * for formating medications from the medication endpoint
 * @param data 
 */
function formatPatientMedications(data:any) : Medication[] | undefined
{
    const medications: Medication[] = [];
    if (data !== null) {
        data.forEach(i => {
            const medication: Medication = {
                id: i.medication.id,
                name: i.medication.name
            };
            medications.push(medication);
        });
        /**
         * i.medication.id i used because the api returns the object as patientMedication [ medication {}]
         * due to the fact that it has a chain include kinda poop
         */
        return medications;
    }
    return undefined;
}

export { formatPatient};