import express from "express";
const router = express.Router();

import { signin, signup, forgottenpw } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/forgottenpw", forgottenpw);

export default router;