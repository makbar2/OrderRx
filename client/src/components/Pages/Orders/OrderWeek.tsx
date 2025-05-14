import { useEffect, useState, useMemo } from "react";
/**
 * memo is going to be used here, as 
 */
import Patient from "../../../Interfaces/Patient";
import PatientTable from "../PatientSearch/PatientTable";
export default function OrderToday()
{
    const [patients, setPatients] = useState<Patient[]>([]);
    useEffect(()=>{
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
                const result: Patient[] = data.map(i => ({
                    id: i.id,
                    firstName: i.firstName,
                    surname: i.surname,
                    email: i.email,
                    phoneNumber: i.phoneNumber,
                    address: i.address,
                    postcode: i.postcode,
                    dob: i.dob,
                    orderDate : i.orderDate,
                    collectionDate : i.collectionDate,
                }));//todo: change the patient search to do this, or not it doesnt matter does the same thing
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
        
    },[]);
    return(
        <>
            <h1>This Weeks Orders</h1>
            <PatientTable mode={1} patients={patients} />
        </>
    );
}


