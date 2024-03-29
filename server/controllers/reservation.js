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
    try {
        const { restId } = req.query;
        const rest = await restaurantModel
            .findById(restId)
            .populate({ path: "reservations", populate: { path: "creator", select: ["first_name", "last_name"] } })
            .populate({ path: "reservations", populate: { path: "tableIds", select: ["name"] } });
        rest.reservations = rest.reservations.filter((res) => res.isActive);
        console.log("tids");
        console.log(rest.reservations);
        return res.status(200).json({ reservations: rest.reservations });
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
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
        const reservation = await reservationModel.create({ name, phone, email, arrive, leave, adult, child, comment, tableReqs, tableIds, creator: req.user._id });
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
    try {
        const reservation = req.body;
        reservation.tableIds = reservation.tableIds.map((table) => table._id);
        reservation.creator = reservation.creator._id;
        delete reservation.createdAt;
        delete reservation.updatedAt;
        reservation.updater = req.user._id;
        await reservationModel.findByIdAndUpdate(reservation._id, reservation);
        console.log(reservation);
        return res.status(200).json({});
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};

export const updateReservationTable = async (req, res) => {
    try {
        const tableIds = req.body.value.map((table) => table._id);
        const id = req.body.id;
        await reservationModel.findByIdAndUpdate(id, { tableIds });
        return res.status(200).json({});
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};

/*
implementation guide in hungary:

 */
export const deleteReservation = async (req, res) => {
    try {
        const { resId } = req.body;
        console.log(req.body);
        await reservationModel.findByIdAndUpdate(resId, { isActive: false });
        return res.status(200).json({});
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};

/*
implementation guide in hungary:

 */
export const getReservationsInPeriod = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

export const guestIsHere = async (req, res) => {
    try {
        const { resId, restId } = req.body;
        await reservationModel.findByIdAndUpdate(resId, { came: true });
        req.io.emit(`refresh-rest-${restId}`);
        return res.status(200).json({});
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
    return res.status(501).json({ error: "Nincs elkészítve" });
};
