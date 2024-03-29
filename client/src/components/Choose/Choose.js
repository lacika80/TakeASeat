import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createRestaurant, getMyRestaurants } from "../../features/restaurantsSlice";

const Choose = ({ socket }) => {
    const user = useSelector((state) => state.auth.user);
    const rests = useSelector((state) => state.restaurants);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: "" });
    const navigate = useNavigate();

    //on page load get the restaurants and config the socket functions
    useEffect(() => {
        dispatch(getMyRestaurants());
        if (socket) {
            socket.on("refresh-rests", () => {
                dispatch(getMyRestaurants());
            });
            return () => {
                //when leave the page cleaning the listener
                socket.off("refresh-rests");
            };
        }
    }, []);
    const handleChange = (e) => {
        if (e.target.name != "seats" || e.target.value >= 0) {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };
    const handleSubmit = () => {
        setOpen(!open);
        dispatch(createRestaurant(form))
            .then(unwrapResult)
            .then((result) => {
                navigate(`/rest/${result.data.id}`);
            });
    };

    return (
        <Paper elevation={3} sx={{ p: 2, minHeight: "20vh" }}>
            <Stack spacing={2}>
                {/*  {rests.error && <Alert severity="error">{rests.error}</Alert>} */}
                {rests.list && (
                    <Table stickyHeader sx={{ pb: 3 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>név</TableCell>
                                <TableCell>Tulajdonos</TableCell>
                                <TableCell>létrehozva</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rests.list.map((rest) => (
                                <TableRow hover key={rest._id}>
                                    <TableCell>{rest.name}</TableCell>
                                    <TableCell>{rest.owner.name}</TableCell>
                                    <TableCell>{rest.createdAt.slice(0, 10)}</TableCell>
                                    <TableCell>
                                        <Button component={Link} to={"rest/" + rest._id}>
                                            Kiválaszt
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                <Box>
                    <Button onClick={() => setOpen(!open)} variant="contained">
                        Új étterem létrehozása
                    </Button>
                </Box>
            </Stack>
            <Dialog open={open} onClose={() => setOpen(!open)}>
                <DialogTitle>Étterem létrehozása</DialogTitle>
                {user.globalPermission & process.env.REACT_APP_G_CREATE_RESTAURANT && user.isVerified ? (
                    <>
                        <DialogContent sx={{ minWidth: "15rem" }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                name="name"
                                label="Étterem neve"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                                value={form.name}
                                required
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(!open)}>Mégsem</Button>
                            {form.name ? <Button onClick={handleSubmit}>Elfogad</Button> : <Button disabled>Elfogad</Button>}
                        </DialogActions>
                    </>
                ) : user.isVerified ? (
                    <DialogContentText sx={{ p: 3 }}>
                        Önnek nincs jogosultsága új étterem létrehozásához. <br />
                        További információhoz írjon a: {process.env.REACT_APP_SUPPORT_EMAIL} email címre.
                    </DialogContentText>
                ) : (
                    <DialogContentText sx={{ p: 3 }}>Étterem létrehozásához kérem érvényesítse e-mail címét!</DialogContentText>
                )}
            </Dialog>
        </Paper>
    );
};
export default Choose;
