import { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'

const RequireAuth = () => {
    const auth = useAuth()
    const location = useLocation();
    
    return auth.user && (auth.user.globalPermission & process.env.REACT_APP_G_IS_ACTIVE) ? (
        <Outlet />
      ) : (
        <Navigate to="/auth" state={{ from: location }} />
      )
};

export default RequireAuth;
