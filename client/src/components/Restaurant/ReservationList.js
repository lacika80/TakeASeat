import { Paper, Container, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ReservationList = () => {
    const rest = useSelector((state) => state.restaurants);
    const [date, setDate] = useState(moment());
    useEffect(() => {
        if (rest?.active?.reservations[0]) console.log(rest.active.reservations[0]);
    }, []);
    const TimeDateChanger = (value) => {
        console.log(moment(value));
        setDate(moment(value));
    };
    return (
        <Container maxWidth="lg">
            <Paper elevation={5} sx={{ minHeight: "25rem" }}>
                <DesktopDatePicker label="Dátum választó" value={date} onChange={TimeDateChanger} inputFormat="MM/DD/YYYY" renderInput={(params) => <TextField {...params} />} />
                <table>
                    <thead>
                        <tr>
                            <td>Név</td>
                            <td>Fő</td>
                            <td>Érkezés</td>
                            <td>Távozás</td>
                            <td>Asztal</td>
                            <td>Asztal specs</td>
                        </tr>
                    </thead>
                    <tbody>
                        {rest?.active?.reservations ? (
                            rest.active.reservations.filter((res) => {
                                let d0 = moment.unix(date.unix());
                                let d24 = moment.unix(date.unix()).hour(24);
                                let a = moment(res.arrive);
                                let l = moment(res.leave);
                                return (d0 <= a && a <= d24) || (a <= d0 && d0 <= l);
                            }).length > 0 ? (
                                rest.active.reservations
                                    .filter((res) => {
                                        let d0 = moment.unix(date.unix());
                                        let d24 = moment.unix(date.unix()).hour(24);
                                        let a = moment(res.arrive);
                                        let l = moment(res.leave);
                                        return (d0 <= a && a <= d24) || (a <= d0 && d0 <= l);
                                    })
                                    .sort((a, b) => {
                                        if (a.arrive > b.arrive) return 1;
                                        if (a.arrive == b.arrive) return 0;
                                        if (a.arrive < b.arrive) return -1;
                                    })
                                    .map((res) => (
                                        <tr key={res._id}>
                                            <td>{res.name}</td>
                                            <td>{res.child == 0 ? res.adult : `${res.adult}+${res.child}`}</td>
                                            <td>{moment(res.arrive).format("MM/DD/YYYY hh:mm")}</td>
                                            <td>{moment(res.leave).format("MM/DD/YYYY hh:mm")}</td>
                                            <td>{res.tableIds}</td>
                                            <td>{res.tableReqs}</td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td> ezen a napon nincs foglalás</td>
                                </tr>
                            )
                        ) : (
                            <tr>
                                <td>foglalás nem található</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Paper>
        </Container>
    );
};

export default ReservationList;
