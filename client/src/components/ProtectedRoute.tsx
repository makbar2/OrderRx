import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";

/**
 * this just checks if the user has a token  and then lets them through, 
 * if not it would
 */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const [authorised,setAuthorised] = useState<boolean>();
    async function checkAuth() {
        try{

            const response = await fetch("https://localhost:7295/auth/check",{
                method : "Get",
                credentials : "include",
            });
            if(response.status === 200)
            {
                
                setAuthorised(true);
            }else{
                setAuthorised(false);
                
            }
        }catch(error)
        {
            console.log("an exception has occured when trying to contact the api: " + error);
        }
    }
    useEffect( ()=>{
        checkAuth();
    },[]);
    if(authorised===true)
    {
        console.log("authroised");
        return <>{children}</>
    }else if(authorised === false){
        return <Navigate to="/login" replace/>
    }

};