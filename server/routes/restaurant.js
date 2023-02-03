import express from "express";
import * as cont from "../controllers/restaurant.js";
import * as admin from "../controllers/admin.js";

const router = express.Router();

import auth from "../middleware/auth.js";

router.get("/", auth, cont.getRestaurants);
router.get("/all", auth, admin.getGlobalRestaurants);
router.get("/:id", auth, cont.getRestaurant);
router.get("/:id/openingHour", auth, cont.getOpeningHour);
router.get("/:id/table", auth, cont.getTables);
router.get("/:id/global", auth, cont.getGlobals);


router.post("/", auth, cont.createRestaurant);
router.post("/:id/table", auth, cont.createTable);

router.patch("/:id", auth, cont.updateRestaurant);
router.patch("/:id/openingHour", auth, cont.editOpeningHour);
router.patch("/:id/table", auth, cont.editTable);
router.patch("/:id/global", auth, cont.setGlobal);

router.delete("/:id/", auth, cont.deleteRestaurant);
router.delete("/:id/table", auth, cont.deleteTable);

export default router;
