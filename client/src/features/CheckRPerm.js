import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";

export const CheckRPerm = (allowedRole) => {
    const rests = useSelector((state) => state.restaurants);
    const user = useSelector((state) => state.auth.user);
    //return auth.user.globalPermission & allowedRole;
    console.log(user);
    return true;
};