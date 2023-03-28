//----------------
//---------------- Work In Progress
//----------------
import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Divider, Fab, LinearProgress, Paper, Typography } from "@mui/material";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Container } from "@mui/system";
import Sidebar from "./Sidebar";
import { styled } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import Table from "./Table";
import TableCreateForm from "./TableCreateForm";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { CheckRPerm } from "../../features/CheckRPerm";

import { getActive, getDetailedReservations } from "../../features/restaurantsSlice";
import { setACtiveRest, relogin } from "../../features/authSlice";
import Menu from "./Menu";
import { unwrapResult } from "@reduxjs/toolkit";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

function Restaurant({ socket }) {
    const auth = useSelector((state) => state.auth);
    const user = auth.user;
    const rest = useSelector((state) => state.restaurants);
    const dispatch = useDispatch();
    const { restId } = useParams();
    const [addRes, setAddRes] = useState(false);
    const [editingTableList, setEditingTableList] = useState(false);
    const location = useLocation();

    useEffect(() => {
        dispatch(getActive(restId))
            .then(unwrapResult)
            .then(() => {
                if (location.pathname.split("/")[3] == "reservations") dispatch(getDetailedReservations(restId));
            });
    }, []);
    useEffect(() => {
        if (rest.active && user.lastActiveRest?._id != rest.active._id && rest.status != "loading")
            dispatch(setACtiveRest(restId))
                .then(unwrapResult)
                .then(() => dispatch(relogin()));
    }, [rest.active]);

    return (
        <>
            <Grid container direction="column" alignItems="center" spacing={2}>
                {/* Button's grid */}
                {rest.active && (
                    <>
                        <Grid xs={12}>
                            <Menu editingTableList={editingTableList} setEditingTableList={setEditingTableList} setAddRes={setAddRes} permission={rest.active?.permission} socket={socket} />
                        </Grid>
                        <Grid xs={12}>
                            <Outlet context={{ editingTableList, setEditingTableList, setAddRes, addRes }} />
                        </Grid>
                    </>
                )}
            </Grid>
        </>
    );
}

export default Restaurant;
