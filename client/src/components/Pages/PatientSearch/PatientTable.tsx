import Patient from "../../../Interfaces/Patient";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";  
import { Button } from "../../ui/button";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
export default function PatientTable({patients,mode=0}: {patients:Patient[],mode:number})
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
                            <TableCell>
                            <Button onClick={() => navigate(`/patients/${patient.id}`)}>
                                Edit
                            </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}