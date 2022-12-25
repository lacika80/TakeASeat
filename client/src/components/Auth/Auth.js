import { Avatar, Button, Paper, Grid, Typography, Container, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Input from "./Input";
import { Form, Navigate, redirect, useNavigate } from "react-router-dom";
import { logout, registration, signin, getStatus, signup, forgottenPW } from "../../features/userSlice";

const initialState = { first_name: "", last_name: "", email: "", password: "", confirmPassword: "" };

const Auth = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState(initialState);
    const [mode, setMode] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);

    const switchMode = (type) => {
        setMode(type);
        setShowPassword(false);
    };

    useEffect(() => {
        if (user.id != null) {
            navigate("/choose");
        }
    }, [user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();

        switch (mode) {
            case "login":
                dispatch(signin({email:form.email, password:form.password}));
                break;
            case "reg":
                dispatch(signup(form));
                break;
            case "forgottenPW":
                dispatch(forgottenPW({email:form.email}));
                break;
            default:
                break;
        }
    };

    /*return (
        <Form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary">
                sign in
            </Button>

            <Grid container justify="flex-end"></Grid>
        </Form>
    );*/

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
                <Form onSubmit={handleSubmit}>
                    <Grid container spacing={2} minWidth={"40rem"} maxWidth={"60rem"}>
                        {mode == "reg" && (
                            <>
                                <Input name="first_name" label="First Name" handleChange={handleChange} autoFocus half />
                                <Input name="last_name" label="Last Name" handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" value={form.email} />
                        {mode != "forgottenPW" && (
                            <Input
                                name="password"
                                label="Password"
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
                </Form>
            </Paper>
        </Box>
    );
};

export default Auth;
