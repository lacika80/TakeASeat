import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Choose = () => {
    return (
        <div>
            <Button component={Link} variant="contained" to="/rest">
                Restaurant
            </Button>
        </div>
    );
};
export default Choose;
