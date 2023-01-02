import { useAuth } from "../hooks/useAuth";

export const CheckGPerm = (allowedRole) => {

    return auth.user.globalPermission & allowedRole;
};