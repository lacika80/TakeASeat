import { Box, Stack, Paper, Typography, Select, MenuItem, InputLabel, FormControl, TextField, FormControlLabel, Checkbox, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const openingTimeTable = () => {
    const [general, setGeneral] = useState({ day: "", openTime: moment().hours(0).minutes(0), closeTime: moment().hours(24).minutes(0), midnight: false });
    return (
        <Stack spacing={2} sx={{ pt: 2 }}>
            <Paper elevation={8} sx={{ p: 1 }}>
                <Stack direction="row" spacing={2}>
                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                        <InputLabel id="daySelect">Nap</InputLabel>
                        <Select
                            labelId="daySelect"
                            id="daySelect"
                            value={general.day}
                            label="Nap"
                            onChange={(event) => {
                                setGeneral({ ...general, day: event.target.value });
                            }}
                        >
                            <MenuItem value={1}>Hétfő</MenuItem>
                            <MenuItem value={2}>Kedd</MenuItem>
                            <MenuItem value={3}>Szerda</MenuItem>
                            <MenuItem value={4}>Csutörtök</MenuItem>
                            <MenuItem value={5}>Péntek</MenuItem>
                            <MenuItem value={6}>Szombat</MenuItem>
                            <MenuItem value={7}>Vasárnap</MenuItem>
                        </Select>
                    </FormControl>
                    <TimePicker
                        label="Nyitás"
                        name="OpenReg"
                        value={general.openTime}
                        ampm={false}
                        onChange={(value) => {
                            setGeneral({ ...general, openTime: value });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <TimePicker
                        label="Zárás"
                        name="CloseReg"
                        value={general.closeTime}
                        ampm={false}
                        disabled={general.midnight}
                        onChange={(value) => {
                            setGeneral({ ...general, closeTime: value });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={general.midnight}
                                onChange={(event) => {
                                    setGeneral({ ...general, midnight: event.target.checked });
                                }}
                            />
                        }
                        label="Éjfél"
                    />
                    <Grid container direction="column" justifyContent="center" alignItems="center" sx={{p:0}}>
                        <Grid>
                            <IconButton color="primary" aria-label="Hozzáadás">
                                <AddIcon sx={{ m: 0, p: 0 }} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
            <Paper>Item 2</Paper>
            <Paper>Item 3</Paper>
        </Stack>
    );
};

export default openingTimeTable;
