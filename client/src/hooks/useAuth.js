import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/authSlice";
//old class for get the user state. still in use on some place
export const useAuth = () => {
    const user = useSelector(selectCurrentUser);

    return useMemo(() => ({ user }), [user]);
};
