import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTable, editTable } from "../../features/restaurantsSlice";

const TableCreateForm = (props) => {
    const initialState = { name: "", seats: 0, spaceId: 0, restId: 0, posx: 0, posy: 0 };
    const { open, setOpen, edit, table, spaceId } = props.props;
    const rest = useSelector((state) => state.restaurants);
    const [form, setForm] = useState(initialState);
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
                setForm({ name: table.name ?? "", seats: table.seats ?? 0, spaceId: table.spaceId, restId: rest.active._id, tableId:table._id });
            } else {
                setForm({ name: "", seats: 0, posx: table.posx, spaceId: table.spaceId, restId: rest.active._id });
            }
    }, [open]);

    return (
        <Dialog open={open} onClose={() => setOpen(!open)}>
            <DialogTitle>{edit ? "Asztal szerkesztése" : "Asztal létrehozása"}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {edit && (
                        <DialogContentText>
                            a {table.posx}.oszlop {table.posy}. asztalának ({table.name}) szerkesztése
                        </DialogContentText>
                    )}

                    <TextField autoFocus margin="dense" id="name" name="name" label="Név" type="text" fullWidth variant="standard" onChange={handleChange} value={form.name} required />
                    <TextField margin="dense" id="seats" name="seats" label="Ülések Száma" type="number" min="0" variant="standard" onChange={handleChange} value={form.seats} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancel}>Mégsem</Button>
                    <Button type="submit">Elfogad</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TableCreateForm;
