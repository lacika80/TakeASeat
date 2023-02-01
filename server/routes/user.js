import express from "express";
const router = express.Router();

import { signin, signup, forgottenpw, relogin, setActiveRest } from "../controllers/user.js";
import auth from "../middleware/auth.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/relogin", auth, relogin);
router.post("/forgottenpw", forgottenpw);
router.patch("/setActiveRest/:restId", setActiveRest)

export default router;
