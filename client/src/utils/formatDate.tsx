
/**
 * needed because collection and order are stored in date time, i could have used date only for them idk why i didnt, i made the set up for dob to do it 
 * too far in and this project isnt going to be used any way
 * @param isoDateString 
 * @param backend if true will format the date so that it can be used for the backend if false then it will do dd/mm/yyyy, set to true as default because cba going back and updating old code
 * @returns 
 */
export default function formatDate(isoDateString:string | undefined,backend:boolean=true) : string
{

    if(isoDateString === undefined)
    {
        return "0001-01-01";//default value
    }else{
        const date = new Date(isoDateString);  
        const year = date.getUTCFullYear();    
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
        const day = String(date.getUTCDate()).padStart(2, '0');         
        return backend ?  `${year}-${month}-${day}` : `${day}-${month}-${year}`;


    }
}