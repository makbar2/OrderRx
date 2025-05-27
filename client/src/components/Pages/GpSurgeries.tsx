import { Input } from "@/components/ui/input";
import GpPractice from "@/Interfaces/GpPractice";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import FormAlert from "../FormAlert";
import { useTitle } from "@/contexts/DashboardTitleContext";

export default function GpSurgeries() {
    const [gp, setGp] = useState<GpPractice>({
        name: "",
        address: "",
        email: "",
        phoneNumber: ""
    });

    const setTitle = useTitle();
    const [responseMessage, setResponseMessage] = useState({
        type: "",
        message: ""
    });

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) 
    {
        const updatedGp: GpPractice = {
            ...gp,
            [e.target.name]: e.target.value // Update the specific field based on name
        };
        setGp(updatedGp); // Update the state with the new value
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) 
    {
        e.preventDefault();
        try
        {
            console.log(gp); // Logging the form data for debugging
            const response = await fetch("https://localhost:7295/gpSurgeries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Name: gp.name,
                    Address: gp.address,
                    Email: gp.email,
                    PhoneNumber: gp.phoneNumber
                })
            });
            if(response.ok) 
            {
                setResponseMessage({
                    message: "GP surgery successfully added",
                    type: "success"
                });
                setGp({
                    name: "",
                    address: "",
                    email: "",
                    phoneNumber: ""
                });
            } else {
                throw new Error(`Response returned ${response.status} ${response.statusText}`);
            }
        }catch(error)
        {
            console.log("An error has occurred when trying to submit the form: " + error);
            setResponseMessage({
                message: `An error has occurred when trying to submit the form: ${error}`,
                type: "failure"
            });
        }
    }

    useEffect(()=>{
        setTitle("Add a gp Surgery");
    },[setTitle]);
    return (
        <>
            <h1>Add a Surgery</h1>
            <form onSubmit={handleSubmit}>
                {responseMessage.type !== "" && <FormAlert type={responseMessage.type} message={responseMessage.message} />}
                <div>
                    <label htmlFor="name">GP Surgery Name</label>
                    <Input id="name" name="name" placeholder="Name" value={gp.name} onChange={handleChange} minLength={4} />
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <Input id="address" name="address"  placeholder="Address" value={gp.address}  onChange={handleChange}  minLength={10}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <Input id="email" name="email"  placeholder="Email" type="email" value={gp.email}  onChange={handleChange}  required
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <Input id="phoneNumber" name="phoneNumber"  type="tel" value={gp.phoneNumber}  onChange={handleChange}  
                        pattern="^(\+44\s?7\d{3}|\(?\(?\d{4}\)?\)?\s?\d{6}|\(?\(?0\d{4}\)?\)?\s?\d{6})$" 
                        placeholder="e.g. 07123 456789 or +44 7123 456789" 
                        required maxLength={13}
                    />
                </div>
                <Button className="mt-1" type="submit">Submit</Button>
            </form>
        </>
    );
}
