import { AppBar, Box, Button, IconButton, List, Paper, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { useAuth } from "../../hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function Navbar() {
    const dispatch = useDispatch();
    const user = useAuth().user;
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {}, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ mb: 2 }}>
                <Toolbar>
                    {/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton> */}
                    <Grid2 justify="space-between" container>
                        <Grid2 item>
                            <Button color="inherit" component={Link} to="/">
                                <Typography>Étterem választó </Typography>
                            </Button>
                            <Button color="inherit" component={Link} to="/userlist">
                                <Typography>Felhasználók</Typography>
                            </Button>
                        </Grid2>
                        <Grid2 item>
                            <Button
                                color="inherit"
                                onClick={async () => {
                                    dispatch(logout());
                                }}
                            >
                                <Typography>Kijelentkezés </Typography>
                            </Button>
                        </Grid2>
                    </Grid2>
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    );
}
