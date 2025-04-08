import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function FormAlert({type,message} : {type:string, message:string})
{
    let colour : string;
    switch(type)
    {
        case "success":
            colour = "green-500";
            break;
        case "failure":
            colour = "rose-500";
            break;
        default:
            colour = "";
            break
    }

    return(
        <>
            <Alert className={`${colour}`}>
                <AlertTitle>{type}</AlertTitle>
                    <AlertDescription>
                        {message}
                    </AlertDescription>
            </Alert>
        </>
    );
}