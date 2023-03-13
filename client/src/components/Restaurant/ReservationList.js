import {
    Paper,
    Container,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Typography,
    Tooltip,
    Autocomplete,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Stack } from "@mui/system";
import { DesktopDatePicker, TimePicker } from "@mui/x-date-pickers";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getDetailedReservations } from "../../features/restaurantsSlice";

const ReservationList = () => {
    const addResInitialState = { name: "", phone: "", email: "", arrive: moment(), leave: moment(), adult: 0, child: 0, comment: "", tableReqs: [], tableIds: [], creator: {} };
    const rest = useSelector((state) => state.restaurants);
    const [date, setDate] = useState(moment());
    const [isSelected, setIsSelected] = useState(false);
    const [selected, setSelected] = useState(addResInitialState);
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const { restId } = useParams();
    const handleArriveDateChange = (val) => setSelected({ ...selected, arrive: val });
    const handleLeaveDateChange = (val) => setSelected({ ...selected, leave: val });

    useEffect(() => {
        if (rest.active && !(rest.status?.reservations != "loading" || rest.status?.reservations != "succeeded")) dispatch(getDetailedReservations(restId));

        if (rest?.active?.reservations[0]) console.log(rest.active.reservations[0]);
    }, []);
    const TimeDateChanger = (value) => {
        console.log(moment(value));
        setDate(moment(value));
    };
    const handleSelect = (event, res) => {
        setSelected({ ...res });
        setIsSelected(true);
    };
    const handleChange = (e) => {
        if (!((e.target.name == "adult" || e.target.name == "child") && e.target.value < 0)) {
            setSelected({ ...selected, [e.target.name]: e.target.value });
        }
    };
    const tableNames = (tables) => {
        let tablestring = "";
        tables.forEach((element, index) => {
            if (element) tablestring += element.name;
            if (tables.length != index + 1) {
                tablestring += ", ";
            }
        });
        return tablestring;
    };
    const tableReqs = (tableReqs) => {
        let tablestring = "";
        tableReqs.forEach((element, index) => {
            if (element) tablestring += element.name;
            if (tableReqs.length != index + 1) {
                tablestring += ", ";
            }
        });
        return tablestring;
    };
    const tables = () => {
        const tables = [];
        rest.active.spaces.forEach((space) => {
            space.tables.forEach((row) => {
                row.forEach((table) => {
                    console.log(table);
                    tables.push(table.name);
                });
            });
        });
        return tables;
    };
    return (
        <>
            <Container maxWidth="lg">
                <Paper elevation={5} sx={{ minHeight: "25rem", p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid>
                            <DesktopDatePicker label="Dátum választó" value={date} onChange={TimeDateChanger} inputFormat="MM/DD/YYYY" renderInput={(params) => <TextField {...params} />} />
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setDate(moment());
                                }}
                            >
                                Most
                            </Button>
                        </Grid>
                    </Grid>

                    <Table sx={{ minWidth: 650, mt: 2 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Név</TableCell>
                                <TableCell>Fő</TableCell>
                                <TableCell>Érkezés</TableCell>
                                <TableCell>Távozás</TableCell>
                                <TableCell>Asztal</TableCell>
                                <TableCell>Asztal specs</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rest?.active?.reservations ? (
                                rest.active.reservations.filter((res) => {
                                    let a = moment(res.arrive);
                                    let l = moment(res.leave);
                                    return (moment(date) <= a && a <= moment(date).hour(24)) || (a <= moment(date) && moment(date) <= l);
                                }).length > 0 ? (
                                    rest.active.reservations
                                        .filter((res) => {
                                            let a = moment(res.arrive);
                                            let l = moment(res.leave);
                                            return (moment(date) <= a && a <= moment(date).hour(24)) || (a <= moment(date) && moment(date) <= l);
                                        })
                                        .sort((a, b) => {
                                            if (a.arrive > b.arrive) return 1;
                                            if (a.arrive == b.arrive) return 0;
                                            if (a.arrive < b.arrive) return -1;
                                        })
                                        .map((res) => (
                                            <TableRow key={res._id} hover onClick={(event) => handleSelect(event, res)}>
                                                <TableCell>
                                                    {res.name}{" "}
                                                    {res.comment && (
                                                        <Tooltip title="Tartalmaz még egyéb infót">
                                                            <Typography>*</Typography>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                                <TableCell>{res.child == 0 ? res.adult : `${res.adult}+${res.child}`}</TableCell>
                                                <TableCell>{moment(res.arrive).format("YYYY/MM/DD hh:mm")}</TableCell>
                                                <TableCell>{moment(res.leave).format("YYYY/MM/DD hh:mm")}</TableCell>
                                                <TableCell>{tableNames(res.tableIds)}</TableCell>
                                                <TableCell>{tableReqs(res.tableReqs)}</TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            {" "}
                                            ezen a napon nincs foglalás
                                        </TableCell>
                                    </TableRow>
                                )
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        foglalás nem található
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Container>
            <Dialog
                open={isSelected}
                onClose={() => {
                    setIsSelected(false);
                    setIsEditing(false);
                }}
            >
                <DialogTitle>{isSelected && `${selected.name} ${moment(selected.arrive).format("HH:mm")}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ maxHeight: "50vh", minWidth: "20rem" }}>
                        {isSelected && isEditing ? (
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    type="text"
                                    label="Név"
                                    variant="standard"
                                    name="name"
                                    value={selected.name == "" ? " " : selected.name}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />

                                <TextField
                                    fullWidth
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    variant="standard"
                                    label="Telefonszám"
                                    value={selected.phone == "" ? " " : selected.phone}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />

                                <TextField type="number" id="adult" name="adult" variant="standard" label="Felnőttek száma" value={selected.adult} onChange={handleChange} autoComplete="off" />

                                <TextField type="number" id="child" name="child" variant="standard" label="Gyerekek/babák száma" value={selected.child} onChange={handleChange} autoComplete="off" />

                                <DesktopDatePicker
                                    label="Érkezés"
                                    name="arriveDate"
                                    inputFormat="YYYY-MM-DD"
                                    onChange={handleArriveDateChange}
                                    value={selected.arrive}
                                    renderInput={(params) => <TextField {...params} />}
                                />

                                <TimePicker
                                    label="Érkezés"
                                    ampm={false}
                                    name="arriveTime"
                                    value={selected.arrive}
                                    onChange={handleArriveDateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />

                                <DesktopDatePicker
                                    label="Távozás"
                                    name="leaveDate"
                                    inputFormat="YYYY-MM-DD"
                                    onChange={handleLeaveDateChange}
                                    value={selected.leave}
                                    minDate={selected.arrive}
                                    renderInput={(params) => <TextField {...params} />}
                                />

                                <TimePicker
                                    label="távozás"
                                    name="leaveTime"
                                    value={selected.leave}
                                    /* minTime={moment("10:00", "HH:mm")}
                        maxTime={moment("22:00", "HH:mm")} */
                                    ampm={false}
                                    minDate={selected.arrive}
                                    /* shouldDisableTime={shouldDisableTime} */
                                    onChange={handleLeaveDateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />

                                <Autocomplete
                                    multiple
                                    id="table-req"
                                    options={rest.active.tableOpts}
                                    onChange={(event, newInputValue) => {
                                        console.log(event);
                                        setSelected({ ...selected, tableReqs: newInputValue });
                                    }}
                                    defaultValue={selected.tableReqs}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option}
                                    renderInput={(params) => <TextField {...params} variant="standard" label="Hely igények" />}
                                />
                                {/* <Autocomplete
                                    multiple
                                    id="table"
                                    options={tables}
                                    defaultValue={selected.tableIds.map((table) => table.name)}
                                    getOptionLabel={(option) => option}
                                    onChange={(event, newInputValue) => {
                                        console.log(event);
                                        setSelected({ ...selected, tableIds: { name: newInputValue } });
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="standard" label="Asztal" />}
                                /> */}
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="comment"
                                    type="text"
                                    label="Megjegyzés"
                                    variant="standard"
                                    name="comment"
                                    value={selected.comment}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                                {/* <Typography>Létrehozta: {selected.creator.name}</Typography> */}
                            </Stack>
                        ) : (
                            <Stack spacing={2}>
                                <TextField fullWidth disabled id="name" type="text" label="Név" variant="standard" name="name" value={selected.name == "" ? " " : selected.name} autoComplete="off" />
                                <TextField
                                    fullWidth
                                    disabled
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    variant="standard"
                                    label="Telefonszám"
                                    value={selected.phone == "" ? " " : selected.phone}
                                    autoComplete="off"
                                />
                                <TextField disabled type="number" id="adult" name="adult" variant="standard" label="Felnőttek száma" value={selected.adult} autoComplete="off" />
                                <TextField disabled type="number" id="child" name="child" variant="standard" label="Gyerekek/babák száma" value={selected.child} autoComplete="off" />
                                <TextField
                                    fullWidth
                                    disabled
                                    id="arrive"
                                    type="text"
                                    label="Érkezés"
                                    variant="standard"
                                    name="arrive"
                                    value={moment(selected.arrive).format("YYYY/MM/DD HH:mm")}
                                    autoComplete="off"
                                />
                                <TextField
                                    fullWidth
                                    disabled
                                    id="leave"
                                    type="text"
                                    label="Távozás"
                                    variant="standard"
                                    name="leave"
                                    value={moment(selected.leave).format("YYYY/MM/DD HH:mm")}
                                    autoComplete="off"
                                />{" "}
                                <Autocomplete
                                    disabled
                                    multiple
                                    id="tags-standard"
                                    options={selected.tableReqs}
                                    defaultValue={selected.tableReqs}
                                    getOptionLabel={(option) => option}
                                    renderInput={(params) => <TextField {...params} variant="standard" label="Hely igények" />}
                                />
                                <Autocomplete
                                    disabled
                                    multiple
                                    id="tags-standard"
                                    options={[]}
                                    defaultValue={selected.tableIds.map((item) => item.name)}
                                    getOptionLabel={(option) => option}
                                    renderInput={(params) => <TextField {...params} variant="standard" label="Asztal" />}
                                />
                                <TextField
                                    disabled
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="comment"
                                    type="text"
                                    label="Megjegyzés"
                                    variant="standard"
                                    name="comment"
                                    value={selected.comment}
                                    autoComplete="off"
                                />
                                {/* <Typography>Létrehozta: {selected.creator.name}</Typography> */}
                            </Stack>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {!isEditing && <Button onClick={() => setIsEditing(true)}>Szerkesztés</Button>}
                    {!isEditing && (
                        <Button
                            onClick={() => {
                                setIsSelected(false);
                                setIsEditing(false);
                            }}
                        >
                            Bezárás
                        </Button>
                    )}
                    {isEditing && (
                        <Button
                            onClick={() => {
                                setIsSelected(false);
                                setIsEditing(false);
                            }}
                        >
                            Mégsem
                        </Button>
                    )}
                    {isEditing && (
                        <Button
                            onClick={() => {
                                console.log(tables());
                            }}
                        >
                            Elfogad
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ReservationList;
