import express from "express";
const router = express.Router();

import { useLink } from "../controllers/dynamicLink.js";

router.get("/", useLink);

export default router;