import { Container, Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Unstable_Grid2";
import Globals from "./Globals";
import OpeningTimeTable from "./OpeningTimeTable";
import { useSelector } from "react-redux";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Grid hidden={value !== index} id={`vertical-tabpanel-${index}`}>
            {value === index && children}
        </Grid>
    );
}

const Settings = ({ socket }) => {
    const rest = useSelector((state) => state.restaurants);
    const [value, setValue] = useState(0);
    const [paperHeight, setPaperHeight] = useState(200);

    const paperRef = useRef(null);
    useEffect(() => {
        if (paperRef.current) {
            setPaperHeight(paperRef.current.offsetHeight);
        }
    }, [paperRef]);

    return (
        <>
            <Container maxWidth="lg">
                <Paper elevation={5} sx={{ minHeight: "25rem", p: 0, display: "flex" }} ref={paperRef}>
                    {rest.active && (
                        <Grid container justifyContent="center" alignItems="flex-start" sx={{ p: 0 }}>
                            <Grid>
                                <Tabs
                                    orientation="vertical"
                                    variant="scrollable"
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                    sx={{ borderRight: 1, borderColor: "divider", height: paperHeight }}
                                >
                                    <Tab label="Étterem beállításai" />
                                    <Tab label="nyitvatartás" />
                                    <Tab label="foglalás" />
                                </Tabs>
                            </Grid>
                            <TabPanel value={value} index={0}>
                                <Globals />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <OpeningTimeTable />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                Item Three
                            </TabPanel>
                        </Grid>
                    )}
                </Paper>
            </Container>
        </>
    );
};

export default Settings;
