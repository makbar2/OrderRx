import { useEffect, useState,} from "react";
/**
 * memo is going to be used here, as 
 */
import Patient from "../../../Interfaces/Patient";
import PatientTable from "../../PatientTable";
import formatDate from "@/utils/formatDate";

export default function OrderToday({setTitle}: {setTitle : React.Dispatch<React.SetStateAction<string>>})
{
    const [patients, setPatients] = useState<Patient[]>([]);
    useEffect(()=>{
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const year = today.getFullYear();
        setTitle(`Orders for  ${day}-${month}-${year}`)
        async function getOrders() {
            const response = await fetch(`https://localhost:7295/patients/orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if(response.ok)
            {   
                const data = await response.json();
                console.log(data);
                const result: Patient[] = data.map((i : Patient) => ({
                    id: i.id,
                    firstName: i.firstName,
                    surname: i.surname,
                    address: i.address,
                    postcode: i.postcode,
                    dob: i.dob,
                    orderDate : formatDate(i.orderDate,false),
                    collectionDate : formatDate(i.collectionDate,false),
                }));//todo: change the patient search to do this, or not it doesnt matter does the same thing
                //meds not included, to increase preformance, when the user opens the dialog  i will return the medication list
                setPatients(result);
                console.log(result);
            }else if(response.status === 404)
            {
                console.log("no orders for this week");
            }else{
                console.log("error in connecting to the api");
            }
        }
        getOrders();
        
    },[setTitle]);
    return(
        <>
            <h1>This Weeks Orders</h1>

            <PatientTable mode={1} patients={patients}  setPatients={setPatients} patientList={patients}/>
        </>
    );
}


