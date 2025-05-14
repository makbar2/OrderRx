
/**
 * needed because collection and order are stored in date time, i could have used date only for them idk why i didnt, i made the set up for dob to do it 
 * too far in and this project isnt going to be used any way
 * @param isoDateString 
 * @returns 
 */
export default function formatToYYYYMMDD(isoDateString:string | undefined) : string
{

    if(isoDateString === undefined)
    {
        return "0001-01-01";//default value
    }else{
        const date = new Date(isoDateString);  
        const year = date.getUTCFullYear();    
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
        const day = String(date.getUTCDate()).padStart(2, '0');         
        return `${year}-${month}-${day}`;    
    }
}