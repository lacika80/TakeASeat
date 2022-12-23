import express from "express";
import { createRestaurant, deleteRestaurant, getRestaurants, getRestaurant, updateRestaurant } from "../controllers/restaurant.js";

const router = express.Router();

import auth from "../middleware/auth.js";

router.get("/", auth, getRestaurants);
router.get("/:id", auth, getRestaurant);

router.post("/create", auth, createRestaurant);

router.patch("/:id", auth, updateRestaurant);

router.delete("/delete", auth, deleteRestaurant);

export default router;
