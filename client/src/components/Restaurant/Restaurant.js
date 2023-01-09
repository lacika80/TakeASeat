//----------------
//---------------- Work In Progress
//----------------
import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useBeforeUnload } from "react-router-dom";

function Restaurant() {

    return (
        <div>
            <Button component={Link} variant="contained" to="/">
                choose
            </Button>
        </div>
    );
};

export default Restaurant;
