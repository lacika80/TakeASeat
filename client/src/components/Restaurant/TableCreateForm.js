import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const TableCreateForm = (props) => {
    const { open, setOpen, edit, table } = props.props;

    const initialState = edit ? { name: table.name ? table.name : "", seats: table.seats ? table.seats : 0 } : { name: "", seats: 0 };

    const [form, setForm] = useState(initialState);

    const handleChange = (e) => {
        if (e.target.name != "seats" || e.target.value >= 0) {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };
    const cancel = () => {
        setOpen(!open);

        setTimeout(() => {
            setForm(initialState);
        }, 1000);
    };
    const handleSubmit = () => {
        
        setOpen(!open);
    };
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
