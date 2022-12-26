import { Paper, Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { verify } from "../../features/linkSlice";

const Verify = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const link = useSelector((state) => state.link);

    useEffect(() => {
        dispatch(verify({token:searchParams.get("token")}));
    }, []);

    return (
        <Box maxWidth="xs" sx={{display: "flex", justifyContent: "center", p: 2 }}>
            <Paper elevation={3} sx={{width: "80%", display: "flex", justifyContent: "center", p: 1}}>
                {link.status == "loading" && <Typography variant="h5">loading...</Typography>}
                {link.status == "succeeded" && <Typography variant="h5">{link.message}</Typography>}
                {link.status == "failed" && <Typography variant="h5">{link.error}</Typography>}
            </Paper>
        </Box>
    );
};

export default Verify;
