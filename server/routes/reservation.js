import express from "express";
import * as cont from "../controllers/reservation.js";
import * as admin from "../controllers/admin.js";

const router = express.Router();

import auth from "../middleware/auth.js";

router.get("/", auth, cont.getReservations);
router.get("/:id", auth, cont.getReservation);
router.get("/openhourDeleteCheck", auth, cont.getReservationsInPeriod);

router.post("/", auth, cont.createReservation);
router.post("/guestIsHere", auth, cont.guestIsHere);
router.post("/update", auth, cont.updateReservation);
router.post("/modifyTable", auth, cont.updateReservationTable);

router.delete("/delete", auth, cont.deleteReservation);

export default router;
