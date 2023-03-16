import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TableCreateForm from "./TableCreateForm";
import { useDispatch } from "react-redux";
import { deleteTable as deltable, guestIsHere } from "../../features/restaurantsSlice";
import { useParams } from "react-router-dom";
import moment from "moment";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

/*
asztal státuszok:
kék: kijelölve
üres: szabad
piros: kéne rajta üljenek, de nincsenek itt
zöld: ülnek rajta
sárga: lassan ittvannak vagy veszélyes ültetni
*/

const Table = ({ table, editingTableList, addRes, addResForm, setAddResForm, reservation, time }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const dispatch = useDispatch();
    const { restId } = useParams();
    const [resChecker, setResChecker] = useState({ inTime: false, here: false, close: false });
    const [actRes, setActRes] = useState("");

    const deleteTable = () => {
        setDeleting(false);
        dispatch(deltable({ tableId: table._id, restId }));
    };
    useEffect(() => {
        reservation.map((res) => {
            if (moment(res.arrive) <= time && moment(res.leave) >= time) {
                setResChecker({ ...resChecker, inTime: true, here: res.came });
                setActRes(res._id);
            } else {
                setResChecker({ ...resChecker, inTime: false });
                setActRes("");
            }
        });
    }, [reservation, time]);
    useEffect(() => {
        console.log(reservation);
       }, [])

    return (
        <>
            {addRes ? (
                <Button
                    variant={addResForm.tableIds.includes(table._id) ? "contained" : "outlined"}
                    color={resChecker.inTime ? (resChecker.here ? "success" : "error") : "primary"}
                    sx={{ width: "10rem" }}
                    onClick={() => {
                        if (addResForm.tableIds.includes(table._id)) setAddResForm({ ...addResForm, tableIds: addResForm.tableIds.filter((item) => item != table._id) });
                        else setAddResForm({ ...addResForm, tableIds: [...addResForm.tableIds, table._id] });
                    }}
                >
                    <Typography align="center">{table.name}</Typography>
                </Button>
            ) : editingTableList == true ? (
                <Button component="div" variant="outlined" sx={{ width: "12rem" }} color="neutral">
                    <Typography align="center">{table.name}</Typography>
                    <IconButton
                        aria-label="delete"
                        color="error"
                        size="small"
                        onClick={() => {
                            setDeleting(true);
                        }}
                    >
                        <DeleteIcon color="error" fontSize="small" />
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        color="primary"
                        size="small"
                        onClick={() => {
                            setOpenEdit(true);
                        }}
                    >
                        <EditIcon color="primary" fontSize="small" />
                    </IconButton>
                </Button>
            ) : resChecker.here ? (
                <Button
                    variant={resChecker.inTime ? "contained" : "outlined"}
                    color={resChecker.inTime ? "success" : "primary"}
                    sx={{ width: "10rem" }}
                    onClick={() => {
                        console.log(table.name);
                    }}
                >
                    <Typography align="center">{table.name}</Typography>
                </Button>
            ) : (
                <Button
                    component="div"
                    variant={resChecker.inTime ? "contained" : "outlined"}
                    color={resChecker.inTime ? "error" : "primary"}
                    sx={{ width: "10rem", px: 0 }}
                    onClick={() => {
                        console.log(table.name);
                    }}
                >
                    <Grid container direction="row" justifyContent="center" alignItems="center" p={0} m={0}>
                        {resChecker.inTime && <Grid sx={{ p: 0 }} xs={3}></Grid>}
                        <Grid sx={{ p: 0 }} xs={6}>
                            <Typography align="center">{table.name}</Typography>
                        </Grid>
                        {resChecker.inTime && (
                            <Grid sx={{ p: 0 }} xs={3}>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        dispatch(guestIsHere({resId:actRes, restId}));
                                    }}
                                >
                                    here
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Button>
            )}
            <Dialog open={deleting} onClose={() => setDeleting(false)}>
                <DialogTitle>Asztal törlése</DialogTitle>
                <DialogContent>
                    <DialogContentText>Biztosan törölni kívánja a(z) {table.name} asztalt?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleting(false)}>Mégsem</Button>
                    <Button onClick={deleteTable}>Elfogad</Button>
                </DialogActions>
            </Dialog>
            <TableCreateForm props={{ open: openEdit, setOpen: setOpenEdit, edit: true, table }} />
        </>
    );
};

export default Table;
