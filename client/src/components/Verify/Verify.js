import { Paper, Box, Typography, CircularProgress } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Container } from "@mui/system";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verify } from "../../features/linkSlice";
//landing page for email verification
const Verify = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const link = useSelector((state) => state.link);
    const navigate = useNavigate();
    //on loaded try to verify the given token
    useEffect(() => {
        dispatch(verify({ token: searchParams.get("token") }))
            .then(unwrapResult)
            .then(() => {
                localStorage.setItem("snack", JSON.stringify({ text: "Sikeres email aktiválás", color: "success" }));
                navigate("/");
            })
            .catch((err) => {
                localStorage.setItem("snack", JSON.stringify({ text: err.data.error, color: "error" }));
                navigate("/");
            });
    }, []);

    return (
        <Box maxWidth="xs" sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            {/* Gives back the token validation result */}
            <Paper elevation={3} sx={{ width: "80%", display: "flex", justifyContent: "center", p: 1, minHeight: "30rem" }}>
                <Container>
                    <Grid2 container justifyContent="center" alignItems="center" spacing={4} direction="column" mt={3}>
                        <Grid2>
                            <Typography variant="h5">email aktiválása</Typography>
                        </Grid2>
                        <Grid2>
                            <CircularProgress />
                        </Grid2>
                    </Grid2>
                </Container>
            </Paper>
        </Box>
    );
};

export default Verify;
