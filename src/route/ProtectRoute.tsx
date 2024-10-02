import { Navigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import React from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;  
}

const ProtectRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isLoggedIn = useUserStore(state => state.isLoggedIn());

    return isLoggedIn ? <>{children}</> : <Navigate to='/login' replace />;
};

export default ProtectRoute;
