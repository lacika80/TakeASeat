import { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'
//check the global permission. if the pages' permission is not that you have then it relocates to the member landing page. - later integrates a user check.
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
