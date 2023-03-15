import { Button, Container, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Menu from "./Menu";
import Grid from "@mui/material/Unstable_Grid2";
import { TimePicker } from "@mui/x-date-pickers";
import Globals from "./Globals";

const Settings = ({ socket }) => {
    return (
        <>
            <Container sx={{ display: "flex" }}>
                <Paper elevation={5} sx={{ position: "relative", minHeight: "25rem" }}>
                    <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={1} my={0.5} sx={{mx:2}}>
                        <Grid sx={{ minHeight:"20rem"}}>
                           <Globals />
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};

export default Settings;
