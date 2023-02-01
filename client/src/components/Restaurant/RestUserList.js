import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const headerStyle = { minWidth: 100 };

const RestUserList = () => {

    const rest = useSelector((state) => state.restaurants.active);
    const dispatch = useDispatch();
    const { restId } = useParams();

    const CheckGPerm = (userId, userPerm, perm) => {
        //when the list user is the actual user, then the checkboxs are disabled
        if (userId == user.id) {
            if (userPerm & perm) return <Checkbox key={userId + "-" + perm} defaultChecked onChange={(e, data) => handleChange(userId + "-" + perm, data)} disabled></Checkbox>;
            else return <Checkbox key={userId + "-" + perm} onChange={(e, data) => handleChange(userId + "-" + perm, data)} disabled></Checkbox>;
        } else {
            if (userPerm & perm) return <Checkbox key={userId + "-" + perm} defaultChecked onChange={(e, data) => handleChange(userId + "-" + perm, data)}></Checkbox>;
            else return <Checkbox key={userId + "-" + perm} onChange={(e, data) => handleChange(userId + "-" + perm, data)}></Checkbox>;
        }
    };

useEffect(() => {
//dispatch(getRestUsers(restId))
 console.log(rest)
}, [])


    return (
        <Container maxWidth={false} sx={{ pt: 2 }}>
            <Paper elevation={5} sx={{ position: "relative", minHeight: "25rem", p: 2 }}>
                {false && userList.error && <Typography variant="h5">{userList.error}</Typography>}
                {true && (
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headerStyle}>ID</TableCell>
                                    <TableCell sx={headerStyle}>Családnév</TableCell>
                                    <TableCell sx={headerStyle}>Keresztnév</TableCell>
                                    <TableCell sx={headerStyle}>email</TableCell>
                                    <TableCell sx={headerStyle}>Asztalok szerkesztése</TableCell>
                                    <TableCell sx={headerStyle}>Foglalás felvétele</TableCell>
                                    <TableCell sx={headerStyle}>Más által felvett foglalás szerkesztése</TableCell>
                                    <TableCell sx={headerStyle}>Felhasználók megtekintése</TableCell>
                                    <TableCell sx={headerStyle}>Felhasználók elérhetőségeiknek megtekintése</TableCell>
                                    <TableCell sx={headerStyle}>Felhasználók jogainak megtekintése</TableCell>
                                    <TableCell sx={headerStyle}>Felhasználók jogainak szerkesztése</TableCell>
                                    <TableCell sx={headerStyle}>Szerkesztési jog adása más felhasználónak</TableCell>
                                    <TableCell sx={headerStyle}>Étterem fő beállításainak megtekintése</TableCell>
                                    <TableCell sx={headerStyle}>Étterem fő beállításainak szerkesztése</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {false &&
                                    userList.users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user._id}</TableCell>
                                            <TableCell>{user.last_name}</TableCell>
                                            <TableCell>{user.first_name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{CheckGPerm(user._id, user.global_permission, process.env.REACT_APP_G_CREATE_RESTAURANT)}</TableCell>
                                            <TableCell>{CheckGPerm(user._id, user.global_permission, process.env.REACT_APP_G_LIST_USERS)}</TableCell>
                                            <TableCell>{CheckGPerm(user._id, user.global_permission, process.env.REACT_APP_G_IS_ACTIVE)}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>
    );
};

export default RestUserList;
