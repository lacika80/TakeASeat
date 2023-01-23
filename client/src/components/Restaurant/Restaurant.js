//----------------
//---------------- Work In Progress
//----------------
import React from "react";
import { Button, Fab, Grid, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Container } from "@mui/system";

const fabStyle = {
    position: "absolute",
    bottom: 20,
    right: 20,
};

function Restaurant() {
    return (
        <>
            <Paper elevation={5}>
                <Container maxWidth="lg" sx={{ position: "relative" }}>
                    {/* parent grid */}
                    <Grid container spacing={1} sx={{ py: 1 }} direction="row" justifyContent="center" alignItems="center">
                        {/* Button's grid */}
                        <Grid container maxWidth="md" justifyContent="space-around" alignItems="center">
                            <Grid item sx={{ p: 1 }}>
                                <Button component={Link} variant="contained" to="/">
                                    choose
                                </Button>
                            </Grid>
                            <Grid item sx={{ p: 1 }}>
                                <Button component={Link} variant="contained" to="/">
                                    choose
                                </Button>
                            </Grid>
                        </Grid>
                        {/* Tables' grid */}
                        <Grid container spacing={0} sx={{ mt: 3, pb: 10 }} direction="row" justifyContent="flex-start" alignItems="flex-start">
                            <Grid container spacing={2} direction="column" justifyContent="flex-start" alignItems="center" lg={3} md={4} sm={6} sx={{ mb: 2 }}>
                                <Grid item>
                                    <Button variant="outlined" sx={{ width: "10rem" }}>
                                        <Typography>asztal 1/1</Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" sx={{ width: "10rem" }}>
                                        <Typography>asztal 1/2</Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" sx={{ width: "10rem" }}>
                                        <Typography>asztal 1/3</Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" sx={{ width: "10rem" }}>
                                        <Typography>asztal +</Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} direction="column" justifyContent="flex-start" alignItems="center" lg={3} md={4} sm={6} sx={{ mb: 2 }}>
                                <Grid item>
                                    <Button variant="outlined" sx={{ width: "10rem" }}>
                                        <Typography>asztal 2/1</Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" sx={{ width: "10rem" }}>
                                        <Typography>asztal 2/2</Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" sx={{ width: "10rem" }}>
                                        <Typography>asztal +</Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} direction="column" justifyContent="flex-start" alignItems="center" lg={3} md={4} sm={6} sx={{ mb: 2 }}>
                                <Grid item>
                                    <Button variant="outlined" sx={{ width: "10rem" }}>
                                        <Typography>asztal +</Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Fab sx={fabStyle} aria-label="add" color="primary">
                        <AddIcon />
                    </Fab>
                </Container>
            </Paper>
        </>
    );
}

export default Restaurant;
