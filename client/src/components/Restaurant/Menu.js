import { Container, Divider, Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect } from "react";

const Menu = ({ editingTableList, setEditingTableList, setAddRes, permission }) => {
    return (
        <Container maxWidth="xl">
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1} my={0.5}>
                <Grid>
                    <Button>Foglalások listája</Button>
                </Grid>
                <Grid>
                    <Button>Étterem beállításaid</Button>
                </Grid>
                {permission & process.env.REACT_APP_R_VIEW_USERS ? (
                    <Grid>
                        <Button>Felhasználók</Button>
                    </Grid>
                ) : (
                    <></>
                )}
                {permission & process.env.REACT_APP_R_VIEW_REST_GLOBALS || permission & process.env.REACT_APP_R_INVITE ? (
                    <Grid>
                        <Button>Étterem kezelése</Button>
                    </Grid>
                ) : (
                    <></>
                )}
                <Grid>
                    <Button>Étterem kezelése</Button>
                </Grid>

                {permission & process.env.REACT_APP_R_CREATE_TABLE ? (
                    <>
                        <Grid>
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
                        {editingTableList ? (
                            <Grid>
                                <Button
                                    onClick={() => {
                                        setEditingTableList(false);
                                    }}
                                >
                                    Kész
                                </Button>
                            </Grid>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </Grid>
            <Container>
                <Divider />
            </Container>
        </Container>
    );
};

export default Menu;
