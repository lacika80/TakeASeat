import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { TimePicker } from "@mui/x-date-pickers";
import React from "react";

const Globals = () => {
    return (
        <>
            <Grid container direction="column" justifyContent="felx-start" alignItems="center" spacing={1}>
                <Grid>
                    <TextField fullWidth id="name" type="text" label="Név" variant="standard" name="name" onChange={() => {}} value={""} />
                </Grid>
                <Grid>
                    <TimePicker label="Alapértelmezett maradási idő" ampm={false} name="arriveTime" value={""} onChange={() => {}} renderInput={(params) => <TextField {...params} />} />
                </Grid>
                <Grid>
                    <TimePicker label="foglalások közötti minimális idő" ampm={false} name="arriveTime" value={""} onChange={() => {}} renderInput={(params) => <TextField {...params} />} />
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
