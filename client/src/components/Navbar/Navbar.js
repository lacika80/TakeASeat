import { AppBar, Box, Button, IconButton, List, Menu, MenuItem, Paper, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { useAuth } from "../../hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Unstable_Grid2";
import { Container } from "@mui/system";

export default function Navbar() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {}, []);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ mb: 1 }}>
                <Toolbar>
                    {/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon /> 
                    </IconButton> */}
                    <Container maxWidth={false}>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                            <Grid container spacing={5} direction="row" alignItems="center">
                                <Grid>
                                    <Button color="inherit" component={Link} to="/">
                                        Étterem választó
                                    </Button>
                                    {user.lastActiveRest && (
                                        <>
                                            {"("}
                                            <Button color="inherit" size="small" component={Link} to={`/rest/${user.lastActiveRest._id}`}>
                                                {user.lastActiveRest.name}
                                            </Button>
                                            {")"}
                                        </>
                                    )}
                                </Grid>
                                <Grid>
                                    <Button
                                        id="basic-button"
                                        color="inherit"
                                        aria-controls={open ? "basic-menu" : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? "true" : undefined}
                                        onClick={handleClick}
                                    >
                                        Admin
                                    </Button>

                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            "aria-labelledby": "basic-button",
                                        }}
                                    >
                                        <MenuItem component={Link} to="/userlist" onClick={handleClose}>
                                            Felhasználók
                                        </MenuItem>
                                    </Menu>
                                </Grid>
                                <Grid>
                                {user.lastActiveRest && <Button color="inherit" component={Link} to={`/rest/${user.lastActiveRest._id}/users`}>Felhasználók</Button>}
                                </Grid>
                            </Grid>
                            <Grid>
                                <Typography>{user.lastName + " " + user.firstName}</Typography>
                            </Grid>
                            <Grid>
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
                    </Container>
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    );
}
