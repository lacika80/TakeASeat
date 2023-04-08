import { Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Globals = () => {
    const rest = useSelector((state) => state.restaurants.active);
    const initialState = { name: rest.name, stayTime: new Date().setTime(moment().hours(rest.global.stay_time/60).minutes(rest.global.stay_time%60).unix()*1000), freeTime:  new Date().setTime(moment().hours(rest.global.free_time/60).minutes(rest.global.free_time%60).unix()*1000)};
    const [form, setForm] = useState(initialState);
    

    return (
        <>
            <Grid container direction="column" justifyContent="felx-start" alignItems="center" spacing={2}>
                <Grid>
                    <TextField
                        fullWidth
                        id="name"
                        type="text"
                        label="Név"
                        variant="standard"
                        name="name"
                        onChange={(e) => {
                            setForm({ ...form, [e.target.name]: e.target.value });
                        }}
                        value={form.name}
                    />
                </Grid>
                <Grid sx={{ pt: 2 }}>
                    <Typography>Étterem foglalási beállításai</Typography>
                </Grid>
                <Grid sx={{ pt: 0 }}>
                    <TimePicker
                        label="Alapértelmezett maradási idő"
                        ampm={false}
                        name="arriveTime"
                        value={form.stayTime}
                        onChange={(val) => {
                            setForm({ ...form, stayTime: val });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
                <Grid sx={{ pt: 0 }}>
                    <TimePicker label="foglalások közötti minimális idő" ampm={false} name="arriveTime" value={form.freeTime} onChange={(val) => {
                            setForm({ ...form, freeTime: val });
                        }} renderInput={(params) => <TextField {...params} />} />
                </Grid>
                <Grid>
                    <FormControlLabel control={<Checkbox defaultChecked />} label="nem elérhető menük elrejtése" />
                </Grid>
                <Grid>
                    <Button>mentés</Button>
                    <Button>Minden egyéni felülírása</Button>
                </Grid>
            </Grid>
        </>
    );
};

export default Globals;
