import { Input } from "@/components/ui/input";
import GpPractice from "@/Interfaces/GpPractice";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { rejects } from "assert";
export default function GpSurgeries()
{

    const [gp, setGp] = useState<GpPractice | undefined>(undefined);
    const [reponseMessage, setResponseMessage] = useState({
        "type" : "",
        "message" : ""
    })

    async function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
        const updatedGp : GpPractice = {
            ...gp,
            [e.target.name] : e.target.value
        }
        setGp(updatedGp);
    }

    function clearForm()
    {
        setGp(undefined);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await fetch("https://localhost:7295/gpSurgeries",{
                method : "POST",
                headers:{
                    "Content-Type": "application/json"
                },
            });
            if(response.ok)
            {
                clearForm();
            }else{
                throw new Error("")
            }
        }catch(error)
        {
            console.log("an error has occured when trying to submit the form" + error);
        }
    }

    return(
        <>
            <h1>Add a surgery</h1>
            <form onSubmit={handleSubmit}>
                {reponseMessage.type !== "" ? <}
                <div>
                    <label htmlFor="name">GP Surgery Name</label>
                    <Input id="name" placeholder="name" value={gp?.name} onChange={handleChange} minLength={4}></Input>
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <Input id="address" placeholder="name" value={gp?.address} onChange={handleChange} minLength={10}></Input>
                </div>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <Input id="email" placeholder="email" type="email" value={gp?.email} onChange={handleChange} required></Input>
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <Input id="phoneNumber" type="tel" value={gp?.phoneNumber} onChange={handleChange} pattern="^(\+44\s?7\d{3}|\(?\(?\d{4}\)?\)?\s?\d{6})$" placeholder="e.g. 07123 456789 or +44 7123 456789" required maxLength={11}></Input>
                </div>
                <Button className="mt-1" type="submit">Submit</Button>
            </form>
        </>
    );
}