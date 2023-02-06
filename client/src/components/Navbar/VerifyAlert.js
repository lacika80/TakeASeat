import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { recreateVerifyEmail } from "../../features/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const VerifyAlert = ({ verifEmailCreated, checkMail }) => {
    const [openRemail, setOpenRemail] = useState(false);
    const [remailForm, setRemailForm] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [isActualEmail, setIsActualEmail] = useState(null);
    const [open, setOpen] = useState(false);
    const [snack, setSnack] = useState({ color: "success", text: "Email sikeresen kiküldve!" });
    const [timedUp, setTimedUp] = useState(moment(verifEmailCreated).add(5, "m").unix() - moment().unix() <= 0);

    const calculateDuration = (eventTime) => moment.duration(Math.max(eventTime - Math.floor(Date.now() / 1000), 0), "seconds");
    function Countdown({ eventTime, interval }) {
        const [duration, setDuration] = useState(calculateDuration(eventTime.unix()));
        const timerRef = useRef(0);
        const timerCallback = useCallback(() => {
            setDuration(calculateDuration(eventTime.unix()));
            if (calculateDuration(eventTime.unix())._milliseconds == 0) {
                clearInterval(timerRef.current);
                setTimedUp(true);
            }
        }, [eventTime]);

        useEffect(() => {
            timerRef.current = setInterval(timerCallback, interval);
            return () => {
                clearInterval(timerRef.current);
            };
        }, [eventTime, verifEmailCreated]);
        return ` 0${duration.minutes()}:${duration.seconds() < 10 ? "0" + duration.seconds() : duration.seconds()}`;
    }
    const remail = () => {
        setRemailForm({ email: user.email ?? "" });
        setOpenRemail(true);
    };
    const handleChange = (e) => {
        setRemailForm({ email: e.target.value });
    };
    return (
        <>
            <Grid container justifyContent="center">
                <Grid>
                    {timedUp ? (
                        <Alert severity="warning">
                            <AlertTitle>Email címe még nincs érvényesítve</AlertTitle>
                            Új érvényesítő levél kéréséhez kérem kattintson
                            <Button size="small" onClick={remail}>
                                ide
                            </Button>
                        </Alert>
                    ) : (
                        <Alert severity="warning">
                            <AlertTitle>Email címe még nincs érvényesítve</AlertTitle>
                            Új érvényesítő email kéréséhez még várjon
                            <Countdown eventTime={moment(verifEmailCreated).add(5, "m")} interval={1000} />
                        </Alert>
                    )}
                </Grid>
            </Grid>
            <Dialog open={openRemail} onClose={() => setOpenRemail(!openRemail)}>
                <DialogTitle>Új érvényesítő email küldése</DialogTitle>

                <DialogContent sx={{ minWidth: "15rem" }}>
                    {isActualEmail === false ? (
                        <TextField autoFocus margin="dense" id="name" name="name" label="email" type="text" fullWidth variant="standard" onChange={handleChange} value={remailForm.email} />
                    ) : (
                        <TextField disabled margin="dense" id="name" name="name" label="email" type="text" fullWidth variant="standard" onChange={handleChange} value={remailForm.email} />
                    )}
                    {isActualEmail === null && (
                        <>
                            <Typography sx={{ pt: 1 }}>Ez az ön email címe</Typography>
                            <Button
                                onClick={() => {
                                    setIsActualEmail(true);
                                }}
                            >
                                Igen
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsActualEmail(false);
                                }}
                            >
                                Nem
                            </Button>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRemail(!openRemail)}>Mégsem</Button>
                    <Button
                        onClick={() => {
                            setOpenRemail(!openRemail);
                            dispatch(recreateVerifyEmail(remailForm))
                                .then(unwrapResult)
                                .then(async () => {
                                    setSnack({ color: "success", text: "Email sikeresen kiküldve!" });
                                    setOpen(true);
                                    await checkMail();
                                    setTimedUp(false);
                                })
                                .catch((obj) => {
                                    setSnack({ color: "error", text: obj.data.error ?? "valami félrement" });
                                    setOpen(true);
                                });
                        }}
                    >
                        Küldés
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity={snack.color} sx={{ width: "100%" }}>
                    {snack.text}
                </Alert>
            </Snackbar>
        </>
    );
};

export default VerifyAlert;
