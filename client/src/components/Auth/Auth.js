import { Avatar, Button, Paper, Grid, Typography, Container, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Input from "./Input";
import { Navigate, redirect, useLocation, useNavigate } from "react-router-dom";
import { logout, registration, signin, getStatus, signup, forgottenPW } from "../../features/authSlice";
import { useAuth } from "../../hooks/useAuth";

const initialState = { first_name: "", last_name: "", email: "", password: "", confirmPassword: "" };

const Auth = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [form, setForm] = useState(initialState);
    //reg-login-forgottenpw changer
    const [mode, setMode] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);

    const switchMode = (type) => {
        setMode(type);
        setShowPassword(false);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        switch (mode) {
            case "login":
                dispatch(signin({ email: form.email, password: form.password }));
                break;
            case "reg":
                dispatch(signup(form));
                break;
            case "forgottenPW":
                dispatch(forgottenPW({ email: form.email }));
                break;
            default:
                break;
        }
    };

    return (
        <Box component="main" maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center", m: 1, p: 1 }}>
            <Paper elevation={3} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: 2 }}>
                <Avatar>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5" sx={{ p: 1 }}>
                    {mode == "reg" && "regisztráció"}
                    {mode == "login" && "Bejelentkezés"}
                    {mode == "forgottenPW" && "Elfelejtett jelszó"}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} minWidth={"40rem"} maxWidth={"60rem"}>
                        {mode == "reg" && (
                            <>
                                <Input name="first_name" label="First Name" handleChange={handleChange} autoFocus half />
                                <Input name="last_name" label="Last Name" handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email" handleChange={handleChange} type="email" value={form.email} autocomplete="email" />
                        {mode != "forgottenPW" && (
                            <Input
                                name="password"
                                label="Jelszó"
                                handleChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                handleShowPassword={handleShowPassword}
                                autocomplete={mode == "login" ? "current-password" : "new-password"}
                            />
                        )}
                        {mode == "reg" && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" autocomplete="new-password" />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
                        {mode == "reg" && "regisztráció"}
                        {mode == "login" && "Bejelentkezés"}
                        {mode == "forgottenPW" && "Új jelszó kérése"}
                    </Button>

                    <Grid container justify="flex-end">
                        <Grid item>
                            {mode == "reg" && (
                                <Button variant="outlined" onClick={() => switchMode("login")}>
                                    Bejelentkezés
                                </Button>
                            )}
                            {mode == "login" && (
                                <Button variant="outlined" onClick={() => switchMode("reg")} sx={{ mr: 2 }}>
                                    Regisztráció
                                </Button>
                            )}
                            {mode == "login" && (
                                <Button variant="outlined" onClick={() => switchMode("forgottenPW")}>
                                    Elfelejtett jelszó
                                </Button>
                            )}
                            {mode == "forgottenPW" && (
                                <Button variant="outlined" onClick={() => switchMode("login")}>
                                    Bejelentkezés
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default Auth;
