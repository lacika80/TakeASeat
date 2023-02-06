import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createRestaurant, getMyRestaurants } from "../../features/restaurantsSlice";

const Choose = ({ socket }) => {
    const user = useSelector((state) => state.auth.user);
    const rests = useSelector((state) => state.restaurants);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: null });

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
        dispatch(createRestaurant(form));
    };

    return (
        <Paper elevation={3} sx={{ p: 2, minHeight: "20vh" }}>
            <Stack spacing={2}>
                {rests.error && <Alert severity="error">{rests.error}</Alert>}
                {rests.list && (
                    <Table stickyHeader sx={{ pb: 3 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>id</TableCell>
                                <TableCell>név</TableCell>
                                <TableCell>létrehozva</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rests.list.map((rest) => (
                                <TableRow hover key={rest._id}>
                                    <TableCell>{rest._id}</TableCell>
                                    <TableCell>{rest.name}</TableCell>
                                    <TableCell>{rest.creation_date.slice(0, 10)}</TableCell>
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
                            <TextField autoFocus margin="dense" id="name" name="name" label="Étterem neve" type="text" fullWidth variant="standard" onChange={handleChange} value={form.name} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(!open)}>Mégsem</Button>
                            <Button onClick={handleSubmit}>Elfogad</Button>
                        </DialogActions>
                    </>
                ) : (
                    <DialogContentText sx={{ p: 3 }}>
                        {user.isVerified ? (
                            <DialogContentText>
                                Önnek nincs jogosultsága új étterem létrehozásához. <br />
                                További információhoz írjon a: {process.env.REACT_APP_SUPPORT_EMAIL} email címre.
                            </DialogContentText>
                        ) : (
                            <DialogContentText>Étterem létrehozásához kérem érvényesítse e-mail címét!</DialogContentText>
                        )}
                    </DialogContentText>
                )}
            </Dialog>
        </Paper>
    );
};
export default Choose;
