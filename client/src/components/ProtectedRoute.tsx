import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

/**
 * this just checks if the user has a token  and then lets them through, 
 * if not it would
 */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem("token"); // or check auth context
    return token ? children : <Navigate to="/login" replace />;
};