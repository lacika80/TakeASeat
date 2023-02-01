import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Autocomplete, Button, Divider, IconButton, TextField, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box } from "@mui/system";
import Grid from "@mui/material/Unstable_Grid2";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment, { now } from "moment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function Sidebar({ addRes, setAddRes, DrawerHeader, drawerWidth, addResForm, setAddResForm, tableOpts }) {
    const handleChange = (e) => {
        if (!((e.target.name == "adult" || e.target.name == "child") && e.target.value < 0)) {
            setAddResForm({ ...addResForm, [e.target.name]: e.target.value });
        }
    };
    const handleArriveDateChange = (val) => setAddResForm({ ...addResForm, arrive: val });
    const handleLeaveDateChange = (val) => setAddResForm({ ...addResForm, leave: val });
    const shouldDisableTime = (value, view) => {
        switch (view) {
            case "minutes":
                return value >= 40 || value <= 20;
            case "hours":
                return value >= 12;
            case "seconds":
                break;
            default:
                break;
        }
    };

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                },
            }}
            variant="persistent"
            anchor="right"
            open={addRes}
        >
            <DrawerHeader>
                <IconButton color="success" size="large" onClick={() => setAddRes(false)}>
                    <ChevronRightIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />
            <Grid container spacing={2} direction="column" alignItems="stretch" sx={{ width: drawerWidth, pl: 2 }}>
                <Grid>
                    <TextField fullWidth id="name" type="text" label="Név" variant="standard" name="name" onChange={handleChange} value={addResForm.name} />
                </Grid>
                <Grid>
                    <TextField fullWidth type="tel" id="phone" name="phone" variant="standard" label="Telefonszám" onChange={handleChange} value={addResForm.phone} />
                </Grid>
                <Grid>
                    <TextField type="number" id="adult" name="adult" variant="standard" label="Felnőttek száma" onChange={handleChange} value={addResForm.adult} />
                </Grid>
                <Grid>
                    <TextField type="number" id="child" name="child" variant="standard" label="Gyerekek/babák száma" onChange={handleChange} value={addResForm.child} />
                </Grid>
                <Grid sx={{ mt: 2 }}>
                    <DesktopDatePicker
                        label="Érkezés"
                        name="arriveDate"
                        inputFormat="YYYY-MM-DD"
                        onChange={handleArriveDateChange}
                        value={addResForm.arrive}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
                <Grid xs={5}>
                    <TimePicker label="Érkezés" ampm={false} name="arriveTime" value={addResForm.arrive} onChange={handleArriveDateChange} renderInput={(params) => <TextField {...params} />} />
                </Grid>
                <Grid sx={{ pr: 12 }}>
                    <Divider />
                </Grid>
                <Grid xs={12}>
                    <DesktopDatePicker
                        label="Távozás"
                        name="leaveDate"
                        inputFormat="YYYY-MM-DD"
                        onChange={handleLeaveDateChange}
                        value={addResForm.leave}
                        minDate={addResForm.arrive}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>

                <Grid xs={5}>
                    <TimePicker
                        label="Érkezés"
                        name="leaveTime"
                        value={addResForm.leave}
                        minTime={moment("10:00", "HH:mm")}
                        maxTime={moment("22:00", "HH:mm")}
                        ampm={false}
                        shouldDisableTime={shouldDisableTime}
                        onChange={handleLeaveDateChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
                <Grid>
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={tableOpts}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} variant="standard" label="Hely igények" />}
                    />
                </Grid>
                <Grid>
                    <Typography color="#8a8a8a" variant="caption">
                        Konkrét asztal kiválasztásához nyomj rá az asztalra az asztaltérképen
                    </Typography>
                </Grid>
                <Grid>
                    <Button variant="contained" fullWidth>
                        Foglalás véglegesítése
                    </Button>
                </Grid>
            </Grid>
        </Drawer>
    );
}
