//----------------
//---------------- OUT OF USE
//----------------
import { Alert, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const Layout = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [snack, setSnack] = useState(null);

    useEffect(() => {
        let ls = JSON.parse(localStorage.getItem("snack"));
        if (ls) {
            setSnack(ls);
            localStorage.removeItem("snack");
            setOpen(true);
        }
    }, [location]);

    const handleClose = () => {
        setOpen(false);
        setSnack(null);
    };
    return (
        <>
            <Outlet />
            {snack && (
                <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={snack.color} sx={{ width: "100%" }}>
                        {snack.text}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
};
