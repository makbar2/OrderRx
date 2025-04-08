import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function FormAlert(type:string,message:string)
{
    let border
    switch(type)
    {
        case "success":

    }
    return(
        <>
        <Alert>
            <AlertTitle>{type}</AlertTitle>
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>
        </>
    );
}