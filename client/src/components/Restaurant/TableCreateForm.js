import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTable, editTable } from "../../features/restaurantsSlice";

const TableCreateForm = (props) => {
    const initialState = { tableName: "", seats: 0, spaceId: 0, restId: 0, posx: 0, posy: 0, tableOpts: [] };
    const { open, setOpen, edit, table, spaceId } = props.props;
    const rest = useSelector((state) => state.restaurants);
    const [form, setForm] = useState(initialState);
    const [tableOpts, setTableOpts] = useState([]);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        if (e.target.name != "seats" || e.target.value >= 0) {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };
    const cancel = () => {
        setOpen(!open);

        setTimeout(() => {
            setForm(initialState);
        }, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpen(!open);
        console.log(form);
        if (edit) dispatch(editTable(form));
        else dispatch(createTable(form));
    };
    useEffect(() => {
        if (open)
            if (edit) {
                setForm({ tableName: table.name ?? "1", seats: table.seats ?? 0, spaceId: table.spaceId, restId: rest.active._id, tableId: table._id, tableOpts: table.tableOpts });
                setTableOpts(rest.active.tableOpts);
            } else {
                setForm({ tableName: "", seats: 0, posx: table.posx, spaceId: table.spaceId, restId: rest.active._id, tableOpts: [] });
                setTableOpts(rest.active.tableOpts);
            }
    }, [open]);

    return (
        <Dialog open={open} onClose={() => setOpen(!open)}>
            <DialogTitle>{edit ? "Asztal szerkesztése" : "Asztal létrehozása"}</DialogTitle>

            <DialogContent>
                {edit && (
                    <DialogContentText>
                        a {table.posx}.oszlop {table.posy}. asztalának ({table.name}) szerkesztése
                    </DialogContentText>
                )}

                <TextField
                    autoFocus
                    margin="dense"
                    id="tableName"
                    name="tableName"
                    autoComplete="off"
                    label="Név"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                    value={form.tableName}
                    required
                />
                <TextField margin="dense" id="seats" name="seats" label="Ülések Száma" type="number" min="0" variant="standard" onChange={handleChange} value={form.seats} />

                <Autocomplete
                    multiple
                    value={form.tableOpts}
                    id="tags-standard"
                    options={tableOpts}
                    onChange={(event, newInputValue) => {
                        console.log(event);
                        setForm({ ...form, tableOpts: newInputValue });
                    }}
                    freeSolo
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params} variant="standard" label="Hely igények" />}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} tabIndex={-1}>
                    Mégsem
                </Button>
                <Button onClick={handleSubmit}>Elfogad</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TableCreateForm;
