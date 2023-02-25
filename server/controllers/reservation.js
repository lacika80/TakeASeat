import dotenv from "dotenv";
import { CreateSocketList } from "../features/lib.js";
import reservationModel from "../models/reservation.js";
import restaurantModel from "../models/restaurant.js";
import UserModel from "../models/user.js";

dotenv.config();

/*
implementation guide in hungary:

 */
export const getReservations = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const getReservation = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const createReservation = async (req, res) => {
    try {
        const { name, phone, email, arrive, leave, adult, child, comment, tableReqs, tableIds, restId } = req.body;
        console.log(req.body);
        const reservation = await reservationModel.create({ name, phone, email, arrive, leave, adult, child, comment, tableReqs, tableIds, creater: req.user._id });
        await restaurantModel.findByIdAndUpdate(restId, { $push: { reservations: reservation._id } });
        req.io.emit(`refresh-rest-${restId}`);
        return res.status(201).json({});
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};

/*
implementation guide in hungary:

 */
export const updateReservation = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const deleteReservation = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const getReservationsInPeriod = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

export const guestIsHere = async (req, res) => {
    try {
        const {resId, restId} = req.body;
        await reservationModel.findByIdAndUpdate(resId, {came:true})
        req.io.emit(`refresh-rest-${restId}`);
        return res.status(200).json({});
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
    return res.status(501).json({ error: "Nincs elkészítve" });
};