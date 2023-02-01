import express from "express";
import * as cont from "../controllers/restaurant.js";
import * as admin from "../controllers/admin.js";

const router = express.Router();

import auth from "../middleware/auth.js";

router.get("/", auth, cont.getRestaurants);
router.get("/all", auth, admin.getGlobalRestaurants);
router.get("/:id", auth, cont.getRestaurant);
router.get("/openingHour", auth, cont.getOpeningHour);
router.get("/table", auth, cont.getTables);
router.get("/global", auth, cont.getGlobals);


router.post("/", auth, cont.createRestaurant);
router.post("/table", auth, cont.createTable);

router.patch("/:id", auth, cont.updateRestaurant);
router.patch("/openingHour", auth, cont.editOpeningHour);
router.patch("/table", auth, cont.editTable);
router.patch("/global", auth, cont.setGlobal);

router.delete("/", auth, cont.deleteRestaurant);
router.delete("/table", auth, cont.deleteTable);

export default router;
