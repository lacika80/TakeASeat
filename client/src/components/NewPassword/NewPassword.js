import { Paper, Box, Typography, Button, TextField, InputAdornment, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, useSearchParams } from "react-router-dom";
import { getEmailFromToken, verify } from "../../features/linkSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialState = { email: "", password: "", confirmPassword: "", token: searchParams.get("token") };

    const dispatch = useDispatch();

    const link = useSelector((state) => state.link);

    const [form, setForm] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);

    useEffect(() => {
        dispatch(getEmailFromToken(searchParams.get("token")));
    }, []);
    useEffect(()=>{
    if (link) {
        setForm({ ...form, email: link.receiver_email });
    }
    }, [link])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(verify(form));
    };

    return (
        <Box component="main" maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center", m: 1, p: 1 }}>
            <Paper elevation={3} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: 2 }}>
                <Typography variant="h5" sx={{ p: 1 }}>
                    Jelszó módosítás
                </Typography>
                {link.validity === false && (
                    <Typography variant="h5" sx={{ p: 1, color: "red" }}>
                        A link nem érvényes
                    </Typography>
                )}
                <Form onSubmit={handleSubmit}>
                    <Grid container spacing={2} minWidth={"40rem"} maxWidth={"60rem"}>
                        <Grid xs={12}>
                            {link.receiver_email && (
                                <TextField disabled fullWidth variant="outlined" name="email" label="Email Address" onChange={handleChange} type="text" defaultValue={link.receiver_email} />
                            )}{" "}
                        </Grid>
                        <Grid xs={12}>
                            <TextField
                                fullWidth
                                required
                                variant="outlined"
                                name="password"
                                label="Password"
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShowPassword}>{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <TextField
                                fullWidth
                                required
                                variant="outlined"
                                name="confirmPassword"
                                label="Repeat Password"
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShowPassword}>{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                    {form.email ? (
                        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
                            {" "}
                            Módosítás
                        </Button>
                    ) : (
                        <Button type="submit" disabled fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
                            {" "}
                            Módosítás
                        </Button>
                    )}
                </Form>
                {link.status == "loading" && <Typography variant="h5">loading...</Typography>}
                {link.status == "failed" && <Typography variant="h5">{link.error}</Typography>}
                {link.status == "succeeded" && <Typography variant="h5">{link.message}</Typography>}
            </Paper>
        </Box>
    );
};

export default Verify;
