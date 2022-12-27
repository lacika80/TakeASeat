import { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'

const RequireAuth = ({ allowedRoles }) => {
    const auth = useAuth()
    const location = useLocation();


    useEffect(() => {
        console.log(auth.user);
    }, [])
    
    return auth.user ? (
        <Outlet />
      ) : (
        <Navigate to="/auth" state={{ from: location }} />
      )
};

export default RequireAuth;
