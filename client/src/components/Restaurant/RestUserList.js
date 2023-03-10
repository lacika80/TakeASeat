import { Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Menu from "./Menu";

const headerStyle = { minWidth: 100 };

const RestUserList = ({ socket }) => {
    const rest = useSelector((state) => state.restaurants.active);
    const dispatch = useDispatch();
    const { restId } = useParams();
    const [invite, setInvite] = useState(false);
    const [form, setForm] = useState({email:"", permission:0})

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
        console.log(rest);
    }, []);

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <Paper elevation={5} sx={{ position: "relative", minHeight: "25rem", p: 2 }}>
                    <Menu socket={socket} />
                    {true ? (
                        <Grid container direction="column" justifyContent="center" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
                            <Grid>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setInvite(!invite);
                                    }}
                                >
                                    {invite ? "m??gsem" : "??j felhaszn??l?? megh??v??sa"}
                                </Button>
                            </Grid>
                            {invite && (
                                <Grid sx={{mb:2}}>
                                    <TableContainer>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={headerStyle}>email</TableCell>
                                                    <TableCell sx={headerStyle}>Asztalok szerkeszt??se</TableCell>
                                                    <TableCell sx={headerStyle}>Foglal??s felv??tele</TableCell>
                                                    <TableCell sx={headerStyle}>M??s ??ltal felvett foglal??s szerkeszt??se</TableCell>
                                                    <TableCell sx={headerStyle}>Felhaszn??l??k megtekint??se</TableCell>
                                                    <TableCell sx={headerStyle}>Felhaszn??l??k el??rhet??s??geiknek megtekint??se</TableCell>
                                                    <TableCell sx={headerStyle}>Felhaszn??l??k jogainak megtekint??se</TableCell>
                                                    <TableCell sx={headerStyle}>Felhaszn??l??k jogainak szerkeszt??se</TableCell>
                                                    <TableCell sx={headerStyle}>Szerkeszt??si jog ad??sa m??s felhaszn??l??nak</TableCell>
                                                    <TableCell sx={headerStyle}>??tterem f?? be??ll??t??sainak megtekint??se</TableCell>
                                                    <TableCell sx={headerStyle}>??tterem f?? be??ll??t??sainak szerkeszt??se</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <TextField></TextField>
                                                    </TableCell>
                                                    <TableCell><Checkbox></Checkbox></TableCell>
                                                    <TableCell><Checkbox></Checkbox></TableCell>
                                                    <TableCell><Checkbox></Checkbox></TableCell>
                                                    <TableCell><Checkbox></Checkbox></TableCell>
                                                    <TableCell><Checkbox></Checkbox></TableCell>
                                                    <TableCell><Checkbox></Checkbox></TableCell>
                                                    <TableCell><Checkbox></Checkbox></TableCell>
                                                    <TableCell><Checkbox></Checkbox></TableCell>
                                                    <TableCell><Checkbox></Checkbox></TableCell>
                                                    <TableCell><Checkbox></Checkbox></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <></>
                    )}
                    {false && userList.error && <Typography variant="h5">{userList.error}</Typography>}
                    {true && (
                        <TableContainer>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={headerStyle}>ID</TableCell>
                                        <TableCell sx={headerStyle}>Csal??dn??v</TableCell>
                                        <TableCell sx={headerStyle}>Keresztn??v</TableCell>
                                        <TableCell sx={headerStyle}>email</TableCell>
                                        <TableCell sx={headerStyle}>Asztalok szerkeszt??se</TableCell>
                                        <TableCell sx={headerStyle}>Foglal??s felv??tele</TableCell>
                                        <TableCell sx={headerStyle}>M??s ??ltal felvett foglal??s szerkeszt??se</TableCell>
                                        <TableCell sx={headerStyle}>Felhaszn??l??k megtekint??se</TableCell>
                                        <TableCell sx={headerStyle}>Felhaszn??l??k el??rhet??s??geiknek megtekint??se</TableCell>
                                        <TableCell sx={headerStyle}>Felhaszn??l??k jogainak megtekint??se</TableCell>
                                        <TableCell sx={headerStyle}>Felhaszn??l??k jogainak szerkeszt??se</TableCell>
                                        <TableCell sx={headerStyle}>Szerkeszt??si jog ad??sa m??s felhaszn??l??nak</TableCell>
                                        <TableCell sx={headerStyle}>??tterem f?? be??ll??t??sainak megtekint??se</TableCell>
                                        <TableCell sx={headerStyle}>??tterem f?? be??ll??t??sainak szerkeszt??se</TableCell>
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
            </Box>
        </>
    );
};

export default RestUserList;
