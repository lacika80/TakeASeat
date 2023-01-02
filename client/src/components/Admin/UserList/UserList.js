import { Checkbox, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { addListener } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser, modifyGPerm } from "../../../features/userListSlice";

const UserList = ({ socket }) => {
    const userList = useSelector((state) => state.userList);
    const user = useSelector((state) => state.auth.user);

    let listItems;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllUser());
    }, []);
    useEffect(() => {
        if (socket) {
            socket.on("connect", () => {
                console.log(socket.id);
            });
            socket.on("refresh-g-users", () => {
                dispatch(getAllUser());
            });
            return () => {
                socket.off("refresh-g-users");
            };
        }
    }, [socket]);

    useEffect(() => {
        if (userList.users) {
            listItems = userList.users.map((user) => <li key={user._id}>{user.last_name + " " + user.first_name}</li>);
        }
        console.log(listItems);
    }, [userList]);

    const CheckGPerm = (userId, userPerm, perm) => {
        console.log(userPerm);
        if (userId == user.id) {
            if (userPerm & perm) return <Checkbox key={userId + "-" + perm} defaultChecked onChange={(e, data) => handleChange(userId + "-" + perm, data)} disabled></Checkbox>;
            else return <Checkbox key={userId + "-" + perm} onChange={(e, data) => handleChange(userId + "-" + perm, data)} disabled></Checkbox>;
        } else {
            if (userPerm & perm) return <Checkbox key={userId + "-" + perm} defaultChecked onChange={(e, data) => handleChange(userId + "-" + perm, data)}></Checkbox>;
            else return <Checkbox key={userId + "-" + perm} onChange={(e, data) => handleChange(userId + "-" + perm, data)}></Checkbox>;
        }
    };
    const handleChange = async (key, data) => {
        try {
            if (data) {
                const identifiers = key.split("-");
                dispatch(modifyGPerm({ id: identifiers[0], perm: identifiers[1], type: "add", socketId: socket.id }));
            } else {
                const identifiers = key.split("-");
                dispatch(modifyGPerm({ id: identifiers[0], perm: identifiers[1], type: "remove", socketId: socket.id }));
            }
        } catch (error) {
            console.log("catch");
            dispatch(getAllUser());
        }
    };
    return (
        <Paper elevation={3} sx={{ p: 2, height: "85vh" }}>
            {userList.error && <Typography variant="h5">{userList.error}</Typography>}
            {userList.users && (
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell key={"0"}>ID</TableCell>
                            <TableCell key={1}>Családnév</TableCell>
                            <TableCell key={2}>Keresztnév</TableCell>
                            <TableCell key={3}>email</TableCell>
                            <TableCell key={4}>Étterem létrehozás</TableCell>
                            <TableCell key={5}>Felhasználó lista megtekintése</TableCell>
                            <TableCell key={6}>Engedélyezett</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.users.map((user) => (
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
            )}
        </Paper>
    );
};

export default UserList;
