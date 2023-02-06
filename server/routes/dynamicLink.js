import express from "express";
import auth from "../middleware/auth.js";
const router = express.Router();

import { useLink, getEmailFromLink, emailCreated } from "../controllers/dynamicLink.js";

router.post("/", useLink);
router.get("/getEmail", getEmailFromLink);
router.get("/emailCreated", auth, emailCreated)

export default router;