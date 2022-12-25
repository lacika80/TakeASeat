import express from "express";
const router = express.Router();

import { useLink, getEmailFromLink } from "../controllers/dynamicLink.js";

router.post("/", useLink);
router.get("/getEmail", getEmailFromLink);

export default router;