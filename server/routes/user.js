import express from "express";
const router = express.Router();

import { signin, signup, forgottenpw, relogin, setActiveRest, recreateVerifyEmail } from "../controllers/user.js";
import auth from "../middleware/auth.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/relogin", auth, relogin);
router.post("/forgottenpw", forgottenpw);
router.post("/recreateverifyemail", auth, recreateVerifyEmail);
router.patch("/setActiveRest/:restId", auth, setActiveRest);

export default router;
