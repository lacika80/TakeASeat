import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TableCreateForm from "./TableCreateForm";

const Table = ({ table, editingTableList, addRes, addResForm, setAddResForm }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);

    return (
        <>
            {addRes ? (
                <Button
                    variant={addResForm.tableId == table._id ? "contained" : "outlined"}
                    sx={{ width: "10rem" }}
                    onClick={() => {
                        {
                            setAddResForm({ ...addResForm, tableId: table._id });
                            console.log(addResForm);
                        }
                    }}
                >
                    <Typography>{table.name}</Typography>
                </Button>
            ) : editingTableList == true ? (
                <Button component="div" variant="outlined" sx={{ width: "12rem" }} color="neutral">
                    <Typography>{table.name}</Typography>
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
            ) : (
                <Button
                    variant="outlined"
                    sx={{ width: "10rem" }}
                    onClick={() => {
                        console.log(table.name);
                    }}
                >
                    <Typography>{table.name}</Typography>
                </Button>
            )}
            <Dialog open={deleting} onClose={() => setDeleting(false)}>
                <DialogTitle>Asztal törlése</DialogTitle>
                <DialogContent>
                    <DialogContentText>Biztosan törölni kívánja a(z) {table.name} asztalt?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleting(false)}>Mégsem</Button>
                    <Button onClick={() => setDeleting(false)}>Elfogad</Button>
                </DialogActions>
            </Dialog>
            <TableCreateForm props={{ open: openEdit, setOpen: setOpenEdit, edit: true, table }} />
        </>
    );
};

export default Table;
