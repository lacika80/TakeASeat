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
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getDetailedReservations } from "../../features/restaurantsSlice";

const ReservationList = () => {
    const rest = useSelector((state) => state.restaurants);
    const [date, setDate] = useState(moment());
    const [isSelected, setIsSelected] = useState(false);
    const [selected, setSelected] = useState("");
    const dispatch = useDispatch();
    const { restId } = useParams();

    useEffect(() => {
        if (rest.active && !(rest.status?.reservations != "loading" || rest.status?.reservations != "succeeded")) dispatch(getDetailedReservations(restId));

        if (rest?.active?.reservations[0]) console.log(rest.active.reservations[0]);
    }, []);
    const TimeDateChanger = (value) => {
        console.log(moment(value));
        setDate(moment(value));
    };
    const handleSelect = (event, resId) => {
        setSelected(resId);
        setIsSelected(true);
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
                                            <TableRow key={res._id} hover onClick={(event) => handleSelect(event, res._id)}>
                                                <TableCell>
                                                    {res.name}{" "}
                                                    {res.comment && (
                                                        <Tooltip title="Tartalmaz még egyéb infót">
                                                            <Typography>*</Typography>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                                <TableCell>{res.child == 0 ? res.adult : `${res.adult}+${res.child}`}</TableCell>
                                                <TableCell>{moment(res.arrive).format("MM/DD/YYYY hh:mm")}</TableCell>
                                                <TableCell>{moment(res.leave).format("MM/DD/YYYY hh:mm")}</TableCell>
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
            <Dialog open={isSelected} onClose={() => setIsSelected(false)}>
                <DialogTitle>res name (arrive)</DialogTitle>
                <DialogContent>
                    <DialogContentText>{selected}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsSelected(false)}>Mégsem</Button>
                    <Button onClick={() => {}}>Elfogad</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ReservationList;
