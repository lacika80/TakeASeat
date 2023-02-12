//----------------
//---------------- Work In Progress
//----------------
import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Divider, Fab, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
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

import { getActive } from "../../features/restaurantsSlice";
import { setACtiveRest, relogin } from "../../features/authSlice";
import Menu from "./Menu";
import { unwrapResult } from "@reduxjs/toolkit";

const drawerWidth = 400;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

const fabStyle = {
    position: "absolute",
    bottom: 20,
    right: 20,
};

/* function compareGrid(a, b) {
    if (a.posx > b.posx || (a.posx == b.posx && a.posy > b.posy)) return 1;
    else return -1;
} */
const addResInitialState = { name: "", phone: "", email: "", arrive: moment(), leave: moment(), adult: 0, child: 0, comment: "", tableReqs: "", tableId: "" };

function Restaurant({ socket }) {
    const auth = useSelector((state) => state.auth);
    const user = auth.user;
    const rest = useSelector((state) => state.restaurants);
    const [addResForm, setAddResForm] = useState(addResInitialState);
    const [addRes, setAddRes] = useState(false);
    const [editingTableList, setEditingTableList] = useState(false);
    const [addTable, setAddTable] = useState(false);
    const [addTableForm, setAddTableForm] = useState({ posx: null, spaceId: null });
    const dispatch = useDispatch();
    const { restId } = useParams();
    /**
     * creates the buttons for add table
     * @param {Number} posx which column you would like to add the table
     */
    const tableAddButton = (posx, spaceId) => {
        return (
            <Grid item>
                <Button
                    variant="outlined"
                    sx={{ width: "10rem" }}
                    onClick={() => {
                        setAddTableForm({ posx: posx, spaceId });
                        setAddTable(true);
                    }}
                >
                    <Typography> + Asztal</Typography>
                </Button>
            </Grid>
        );
    };
    useEffect(() => {
        dispatch(getActive(restId))
            .then(unwrapResult)
            .then((obj) => {});
        if (socket) {
            socket.on(`refresh-rest-${restId}`, () => {
                console.log("frissités");
                dispatch(getActive(restId));
            });
            return () => {
                //when leave the page cleaning the listener
                socket.off(`refresh-rest-${restId}`);
            };
        }
    }, []);
    useEffect(() => {
        if (rest.active && user.lastActiveRest?._id != rest.active._id && rest.status != "loading")
            dispatch(setACtiveRest(restId))
                .then(unwrapResult)
                .then(() => dispatch(relogin()));
    }, [rest.active]);

    return (
        <>
            {rest.status == "loading" && <LinearProgress />}
            <Box sx={{ display: "flex" }}>
                <Main open={addRes}>
                    <Paper elevation={5} sx={{ position: "relative", minHeight: "25rem" }}>
                        {/* parent grid */}

                        <Grid container spacing={1} sx={{ py: 1 }} direction="row" justifyContent="center" alignItems="center">
                            {/* Button's grid */}
                            <Menu editingTableList={editingTableList} setEditingTableList={setEditingTableList} setAddRes={setAddRes} permission={rest.active?.permission} />
                            {/* Tables' grid */}
                            {rest.active?.spaces &&
                                rest.active.spaces.map(
                                    (space) =>
                                        space.tables && (
                                            <Grid key={space._id} container spacing={0} sx={{ mt: 3, pb: 10 }} direction="row" justifyContent="flex-start" alignItems="flex-start">
                                                {space.tables.map((tableColumn, index) => (
                                                    <Grid key={`column${index}`} container item spacing={2} direction="column" justifyContent="flex-start" alignItems="center" lg={3} md={4} sm={6} sx={{ mb: 2 }}>
                                                        {tableColumn.map((table,index2) => (
                                                            <Grid item key={`table${index}${index2}`}>
                                                                <Table table={table} editingTableList={editingTableList} addRes={addRes} addResForm={addResForm} setAddResForm={setAddResForm} />
                                                            </Grid>
                                                        ))}
                                                        {editingTableList && tableAddButton(index, space._id)}
                                                    </Grid>
                                                ))}
                                                {/* -------------------------EZT CHECKOLNI --------------------------------------- */}
                                                {space.tables.length == 0 && rest.active.permission & process.env.REACT_APP_R_CREATE_TABLE && (
                                                    <Grid container item spacing={2} direction="column" justifyContent="flex-start" alignItems="center" lg={3} md={4} sm={6} sx={{ mb: 2 }}>
                                                        {editingTableList && tableAddButton(0, space._id)}
                                                    </Grid>
                                                )}
                                                {editingTableList && space.tables.length < 4 && (
                                                    <Grid container item spacing={2} direction="column" justifyContent="flex-start" alignItems="center" lg={3} md={4} sm={6} sx={{ mb: 2 }}>
                                                        {tableAddButton(space.tables.length, space._id)}
                                                    </Grid>
                                                )}
                                            </Grid>
                                        )
                                )}
                            {rest.active?.spaces[0]?.tables && rest.active.spaces[0].tables.length == 0 && editingTableList && (
                                <Grid container spacing={0} sx={{ mt: 3, pb: 10 }} direction="row" justifyContent="flex-start" alignItems="flex-start">
                                    <Grid container item spacing={2} direction="column" justifyContent="flex-start" alignItems="center" lg={3} md={4} sm={6} sx={{ mb: 2 }}>
                                        {editingTableList && tableAddButton(0, rest.active.spaces[0]._id)}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>

                        {editingTableList ? (
                            <Fab sx={fabStyle} aria-label="add reservation panel" color="primary" disabled>
                                <AddIcon />
                            </Fab>
                        ) : (
                            <Fab sx={fabStyle} aria-label={addRes ? "hide panel" : "add reservation panel"} color="primary" onClick={() => setAddRes(!addRes)}>
                                {addRes ? <RemoveIcon /> : <AddIcon />}
                            </Fab>
                        )}
                    </Paper>
                </Main>
                <Sidebar
                    DrawerHeader={DrawerHeader}
                    setAddRes={setAddRes}
                    addRes={addRes}
                    drawerWidth={drawerWidth}
                    addResForm={addResForm}
                    setAddResForm={setAddResForm}
                    tableOpts={rest.active ? (rest.active.tableOpts ? rest.active.tableOpts : []) : []}
                />
            </Box>
            <TableCreateForm props={{ open: addTable, setOpen: setAddTable, edit: false, table: addTableForm }} />
        </>
    );
}

export default Restaurant;
