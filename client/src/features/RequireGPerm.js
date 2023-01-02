import { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'

const RequireGPerm = ({ allowedRoles }) => {
    const auth = useAuth()
    const location = useLocation();
    
    return auth.user.globalPermission & allowedRoles ? (
        <Outlet />
      ) : (
        <Navigate to="/" state={{ from: location }} />
      )
};

export default RequireGPerm;
