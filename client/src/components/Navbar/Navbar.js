import { Box, Button, Toolbar } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/user/userSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const token = user?.token;
        console.log(token);
    }, [location]);

    useEffect(() => {
        console.log(user);
        if (user.id==null) {
            navigate("/auth");
        }else{console.log(user.id)}
    }, [user, dispatch]);

    return (
        <Box sx={{ border: 2, borderColor: "primary.main", display: "flex", m: 1, p: 1 }}>
            <Toolbar>
                {user ? (
                    <div>
                        <Button
                            variant="contained"
                            onClick={() => {
                                dispatch(logout());
                            }}
                        >
                            logout
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Button component={Link} variant="contained" to="/auth">
                            login
                        </Button>
                    </div>
                )}
            </Toolbar>
        </Box>
    );
}
