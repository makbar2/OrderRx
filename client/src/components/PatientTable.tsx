import Patient from "../Interfaces/Patient";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";  
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import OrderDialog from "@/components/Pages/Orders/OrderDialog";
export default function PatientTable({patients,mode=0, patientList,setPatients }: {patients:Patient[],mode:number, patientList : Patient[],setPatients : React.Dispatch<React.SetStateAction<Patient[]>>})
{
    const navigate = useNavigate();
    return (
        <>
            <Table className="table-fixed">
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-240px">Patient Name</TableHead>
                        <TableHead className="min-w-240px">Date Of Birth</TableHead>
                        <TableHead className="min-w-240px">Address</TableHead>
                        <TableHead className="min-w-240px">Post Code</TableHead>
                        {mode === 1? <TableHead className="min-w-240px">Order Date</TableHead> : "" }
                        {mode === 1? <TableHead className="min-w-240px">Collection Date</TableHead> : "" }
                        <TableHead className="min-w-240px"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patients.map((patient : Patient)=>(
                        <TableRow key={patient.id}>
                            <TableCell>{`${patient.firstName} ${patient.surname}`}</TableCell>
                            <TableCell>{patient.dob}</TableCell>
                            <TableCell>{patient.address}</TableCell>
                            <TableCell>{patient.postcode}</TableCell>
                            {mode === 1? <TableCell>{patient.orderDate}</TableCell> : "" }
                            {mode === 1? <TableCell>{patient.collectionDate}</TableCell> : "" }
                            <TableCell>
                                {mode ===1 ? <OrderDialog patient={patient} setPatients={setPatients} patientList={patientList}/> : <Button onClick={() => navigate(`/patients/${patient.id}`)} >Edit</Button>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}