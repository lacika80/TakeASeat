import { Alert, Button, Input, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createRestaurant, getMyRestaurants } from "../../features/restaurantsSlice";

const Choose = ({ socket }) => {
    const user = useSelector((state) => state.auth.user);
    const rests = useSelector((state) => state.restaurants);
    //hides the creating field
    const [creating, setCreating] = useState(false);
    const [newRestName, setNewRestName] = useState("");
    const dispatch = useDispatch();

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

    const creatingSwitch = () => {
        setCreating(!creating);
    };
    //dispach for create new restaurant
    const createRest = (e) => {
        e.preventDefault();
        dispatch(createRestaurant({ name: newRestName }));
    };
    //WIP - check on every change that is there a restaurant with this name
    const nameChangeHandler = (e) => {
        console.log(e.target.value);
        setNewRestName(e.target.value);
    };

    return (
        <Paper elevation={3} sx={{ p: 2, minHeight: "20vh" }}>
            {!user.isVerified && <Alert severity="error">This is an error alert — check it out!</Alert>}
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
            {creating && (
                <form onSubmit={createRest}>
                    <Input name="name" id="name" type="text" placeholder="Étterem neve" onChange={nameChangeHandler} required></Input>
                    {/*  if the user is not allowed to create restaurant then the button will disabled */}
                    {user.globalPermission & process.env.REACT_APP_G_CREATE_RESTAURANT && user.isVerified ? (
                        <Button type="submit" variant="contained">
                            Létrehozás
                        </Button>
                    ) : (
                        <Button type="submit" variant="contained" disabled>
                            Létrehozás
                        </Button>
                    )}
                </form>
            )}
            {/*  if the user is not allowed to create restaurant then the button will disabled */}
            {user.globalPermission & process.env.REACT_APP_G_CREATE_RESTAURANT && user.isVerified ? (
                <Button onClick={creatingSwitch} variant="contained">
                    Új étterem létrehozása
                </Button>
            ) : (
                <Button variant="contained" disabled>
                    Új étterem létrehozása
                </Button>
            )}
        </Paper>
    );
};
export default Choose;
