import { Container, Divider, Button, LinearProgress } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getActive } from "../../features/restaurantsSlice";

const Menu = ({ editingTableList, setEditingTableList, setAddRes, socket }) => {
    const rest = useSelector((state) => state.restaurants);
    const { restId } = useParams();
    const permission = rest.active?.permission;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getActive(restId));
        if (socket) {
            console.log("subscribed");
            socket.on(`refresh-rest-${restId}`, () => {
                console.log("frissités");
                dispatch(getActive(restId));
            });
            return () => {
                //when leave the page cleaning the listener
                socket.off(`refresh-rest-${restId}`);
            };
        }
    }, [socket]);

    return (
        <Container maxWidth="xl" sx={{ mb: 3 }}>
             {rest.status == "loading" && <LinearProgress />}
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1} my={0.5}>
                <Grid>
                    <Button component={Link} to={`/rest/${restId}`}>
                        Asztal térkép
                    </Button>
                </Grid>
                <Grid>
                    <Button>Foglalások listája</Button>
                </Grid>
                <Grid>
                    <Button>Étterem beállításaid</Button>
                </Grid>
                {permission & process.env.REACT_APP_R_VIEW_USERS || permission & process.env.REACT_APP_R_INVITE ? (
                    <Grid>
                        <Button component={Link} to={`/rest/${restId}/users`}>
                            Felhasználók
                        </Button>
                    </Grid>
                ) : (
                    <></>
                )}
                {permission & process.env.REACT_APP_R_VIEW_REST_GLOBALS ? (
                    <Grid>
                        <Button>Étterem kezelése</Button>
                    </Grid>
                ) : (
                    <></>
                )}

                {permission & process.env.REACT_APP_R_CREATE_TABLE ? (
                    <>
                        <Grid>
                            {editingTableList ? (
                                <Button disabled>Asztallista Szerkesztése</Button>
                            ) : rest.active && rest.status == "succeeded" && rest.active.spaces[0].tables.length == 0 ? (
                                <Button
                                    color="success"
                                    onClick={() => {
                                        setEditingTableList(true);
                                        setAddRes(false);
                                    }}
                                >
                                    Asztallista Szerkesztése
                                </Button>
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
