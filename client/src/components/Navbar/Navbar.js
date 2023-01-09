import { AppBar, Box, Button, IconButton, List, Paper, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { useAuth } from "../../hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";
import Grid2 from "@mui/material/Unstable_Grid2";
import Grid from '@mui/material/Grid';

export default function Navbar() {
    const user = useSelector((state)=>state.auth.user)
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {}, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ mb: 2 }}>
                <Toolbar>
                   {/*  still not really know how will this look like */}
                    {/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon /> 
                    </IconButton> */}
                    <Grid justifyContent="space-between" container  alignItems="center">
                        <Grid item>
                            <Button color="inherit" component={Link} to="/">
                                Étterem választó 
                            </Button>
                            <Button color="inherit" component={Link} to="/userlist">
                               Felhasználók
                            </Button>
                        </Grid>
                        <Grid item>
                            <Typography>{user.lastName+" "+user.firstName}</Typography>
                        </Grid>
                        <Grid item>
                        
                            <Button
                                color="inherit"
                                onClick={async () => {
                                    dispatch(logout());
                                }}
                            >
                                Kijelentkezés 
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    );
}
