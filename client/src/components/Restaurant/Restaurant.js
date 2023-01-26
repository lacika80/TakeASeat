//----------------
//---------------- Work In Progress
//----------------
import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Fab, Grid, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
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

const drawerWidth = 400;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
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
const tables = [
    {
        id: 1121,
        name: "beltér",
        tables: [
            [
                { id: 1, name: "asztal 1/1", posx: 1, posy: 1, seats: 6, space: 1121 },
                { id: 2, name: "asztal 1/2", posx: 1, posy: 2, seats: 3, space: 1121 },
                { id: 3, name: "asztal 1/3", posx: 1, posy: 3, seats: 4, space: 1121 },
            ],
            [
                { id: 4, name: "asztal 2/1", posx: 2, posy: 1, seats: 2, space: 1121 },
                { id: 5, name: "asztal 2/2", posx: 2, posy: 2, seats: 1, space: 1121 },
            ],
            [{ id: 6, name: "asztal 3/1", posx: 3, posy: 1, seats: 1, space: 1121 }],
        ],
    },
];
/* function compareGrid(a, b) {
    if (a.posx > b.posx || (a.posx == b.posx && a.posy > b.posy)) return 1;
    else return -1;
} */
const addResInitialState = { name: "", phone: "", email: "", arrive: moment(), leave: moment(), adult: 0, child: 0, comment: "", tableReqs: "", tableId: "" };

function Restaurant() {
    const [addResForm, setAddResForm] = useState(addResInitialState);
    const [addRes, setAddRes] = useState(true);
    const [editingTableList, setEditingTableList] = useState(false);
    const [addTable, setAddTable] = useState(false);
    const [addTablePosX, setAddTablePosX] = useState(0);
    /**
     * creates the buttons for add table
     * @param {Number} posx which column you would like to add the table
     */
    const tableAddButton = (posx) => {
        return (
            <Grid item>
                <Button
                    variant="outlined"
                    sx={{ width: "10rem" }}
                    onClick={() => {
                        setAddTablePosX(posx + 1);
                        setAddTable(true);
                    }}
                >
                    <Typography>table +</Typography>
                </Button>
            </Grid>
        );
    };

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <Main open={addRes}>
                    <Paper elevation={5} sx={{ position: "relative" }}>
                        {/* parent grid */}
                        <Grid container spacing={1} sx={{ py: 1 }} direction="row" justifyContent="center" alignItems="center">
                            {/* Button's grid */}
                            <Grid container maxWidth="md" justifyContent="space-around" alignItems="center">
                                <Grid item sx={{ p: 1 }}>
                                    {editingTableList ? (
                                        <Button disabled>Asztallista Szerkesztése</Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                setEditingTableList(true);
                                                setAddRes(false);
                                            }}
                                        >
                                            Asztallista Szerkesztése
                                        </Button>
                                    )}
                                </Grid>
                                <Grid item sx={{ p: 1 }}>
                                    {editingTableList ? (
                                        <Button
                                            onClick={() => {
                                                setEditingTableList(false);
                                            }}
                                        >
                                            Kész
                                        </Button>
                                    ) : (
                                        <></>
                                    )}
                                </Grid>
                            </Grid>
                            <Container>
                                <Divider />
                            </Container>
                            {/* Tables' grid */}
                            <Grid container spacing={0} sx={{ mt: 3, pb: 10 }} direction="row" justifyContent="flex-start" alignItems="flex-start">
                                {tables &&
                                    tables[0].tables.map((tableColumn, index) => (
                                        <Grid container item spacing={2} direction="column" key={index} justifyContent="flex-start" alignItems="center" lg={3} md={4} sm={6} sx={{ mb: 2 }}>
                                            {tableColumn.map((table) => (
                                                <Grid item key={table.id}>
                                                    <Table table={table} editingTableList={editingTableList} addRes={addRes} addResForm={addResForm} setAddResForm={setAddResForm} />
                                                </Grid>
                                            ))}
                                            {editingTableList && tableAddButton(index)}
                                        </Grid>
                                    ))}
                                {editingTableList && tables[0].tables.length < 4 && (
                                    <Grid container item spacing={2} direction="column" justifyContent="flex-start" alignItems="center" lg={3} md={4} sm={6} sx={{ mb: 2 }}>
                                        {tableAddButton(tables[0].tables.length)}
                                    </Grid>
                                )}
                            </Grid>
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
                <Sidebar DrawerHeader={DrawerHeader} setAddRes={setAddRes} addRes={addRes} drawerWidth={drawerWidth} addResForm={addResForm} setAddResForm={setAddResForm} />
            </Box>
            <TableCreateForm props={{ open: addTable, setOpen: setAddTable, edit: false, table: { posx: addTablePosX } }} />
        </>
    );
}

export default Restaurant;
