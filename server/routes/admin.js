import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";

import { getAllUser, modifyGPerm } from "../controllers/admin.js";

router.post("/getalluser",auth, getAllUser);
router.post("/modifyGPerm",auth, modifyGPerm);
export default router;