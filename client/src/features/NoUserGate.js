import { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'

const NoUserGate = () => {
    const auth = useAuth()
    const location = useLocation();


    useEffect(() => {
    }, [])
    
    return auth.user  && (auth.user.globalPermission & process.env.REACT_APP_G_IS_ACTIVE) ? (
      <Navigate to="/" state={{ from: location }} />
      ) : (
        <Outlet />
      )
};

export default NoUserGate;
