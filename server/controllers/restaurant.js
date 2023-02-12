import mongoose from "mongoose";
import moment from "moment";

import restaurantModel from "../models/restaurant.js";
import userModel from "../models/user.js";
import RestPermissionModel from "../models/restPermission.js";
import SpaceModel from "../models/space.js";
import GlobalModel from "../models/global.js";
import TableModel from "../models/table.js";

export const createRestaurant = async (req, res) => {
    const { name } = req.body;
    if (!(req.user.global_permission & process.env.G_CREATE_RESTAURANT)) {
        req.io.to(Object.keys(req.users).find((key) => req.users[key] === req.userId)).emit("refresh-user");
        return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
    }
    try {
        const user = await userModel
            .findById(req.user._id)
            .populate({ path: "restaurants", select: ["name", "owner"] })
            .lean();
        const rests = [];
        user.restaurants.forEach((item) => {
            if (item.owner == user._id.toString()) rests.push(item.name);
        });
        if (rests.includes(name)) {
            return res.status(400).json({ error: `Ilyen nevű éttermed már van (${name})` });
        }
        const space = await SpaceModel.create({});
        const restaurant = await restaurantModel.create({
            name: name,
            owner: req.userId,
            users: [{ user: req.user._id, permission: process.env.R_OWNER }],
            spaces: [space._id],
        });
        await userModel.findByIdAndUpdate(req.userId, { $push: { restaurants: restaurant._id } });
        req.io.to(Object.keys(req.users).find((key) => req.users[key] === req.userId)).emit("refresh-rests");
        return res.status(201).json({ id: restaurant._id.toString() });
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};
export const deleteRestaurant = async (req, res) => {};
export const getRestaurants = async (req, res) => {
    const user = await userModel
        .findById(req.userId, "restaurants")
        .populate({ path: "restaurants", select: ["name", "owner", "createdAt"], populate: { path: "owner", select: ["first_name", "last_name"] } });
    return res.status(200).json(user.restaurants);
};
export const getRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, userId } = req;
        let rest;
        if (!(rest = await restaurantModel.findById(id))) return res.status(404).json({ error: "Hibás étterem id" });
        user.restaurants.map((item, index) => {
            user.restaurants[index] = item.toString();
        });
        if (user.restaurants.includes(id)) {
            const restaurant = (
                await restaurantModel.findById(id).populate({
                    path: "spaces",
                    // Get friends of friends - populate the 'friends' array for every friend
                    populate: { path: "tables" },
                })
            ).toObject();
            restaurant.users.map((item) => {
                if (user._id.toString() == item.user.toString()) restaurant.permission = item.permission;
            });
            return res.status(200).json({ restaurant });
        } else return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};

/*
implementation guide in hungary:

 */
export const updateRestaurant = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const getGlobals = async (req, res) => {
    try {
        const { user } = req;
        const restaurantId = req.params.id;
        const userPerm = await RestPermissionModel.findOne({ user_id: user.id, restaurant_id: restaurantId });
        if (!((userPerm != null && userPerm.permission & R_VIEW_REST_GLOBALS) || user.global_permission & process.env.G_LOOK_IN_RESTAURANTS)) {
            return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
        }
        const restaurant = (await restaurantModel.findById(req.params.id).populate("Global")).toObject();
        return res.status(200).json({ global: restaurant.global });
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};

/*
implementation guide in hungary:

 */
export const setGlobal = async (req, res) => {
    try {
        const { user } = req;
        const restaurantId = req.params.id;
        const { formdata } = req.body;
        const userPerm = await RestPermissionModel.findOne({ user_id: user.id, restaurant_id: restaurantId });
        if (
            !(
                (userPerm != null && userPerm.permission & R_VIEW_REST_GLOBALS) ||
                (user.global_permission & process.env.G_LOOK_IN_RESTAURANTS && user.global_permission & process.env.G_EDIT_RESTAURANTS)
            )
        ) {
            return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
        }
        const restaurant = await restaurantModel.findById(restaurantId);
        await GlobalModel.findByIdAndUpdate(restaurant.global, formdata);
        return res.status(200);
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};

/*
implementation guide in hungary:

 */
export const getOpeningHour = async (req, res) => {
    try {
        const { user } = req;
        const restaurantId = req.params.id;
        const userPerm = await RestPermissionModel.findOne({ user_id: user.id, restaurant_id: restaurantId });
        if (!((userPerm != null && userPerm.permission & R_VIEW_REST_GLOBALS) || user.global_permission & process.env.G_LOOK_IN_RESTAURANTS)) {
            return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
        }
        const restaurant = (await restaurantModel.findById(req.params.id).populate("openingTimes")).toObject();
        return res.status(200).json({ OpeningTimes: restaurant.openingTimes });
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};

/*
implementation guide in hungary:

 */
export const editOpeningHour = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const getTables = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const createTable = async (req, res) => {
    try {
        const { name, seats, posx, spaceId, restId } = req.body;
        //get the restaurant and the requester's permission
        const rest = await restaurantModel.findById(restId);
        const restUser = rest.users.filter((user) => user.user.toString() == req.userId)[0];
        if (!(restUser.permission & process.env.R_CREATE_TABLE)) return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
        const space = await SpaceModel.findById(spaceId).populate("tables").lean();
        space.tables = space.tables.filter((table) => table.is_active === true);
        const posy = space.tables.length > 0 ? Math.max(...space.tables.filter((table) => table.posx == posx).map((table) => table.posy)) + 1 : 0;
        //const posy = Math.max(...(await SpaceModel.findById(spaceId).lean()).tables.filter((table) => table.posx == posx).map((table) => table.posy)) + 1;
        const table = await TableModel.create({ name, posx, posy });
        const updated = await SpaceModel.findByIdAndUpdate(
            spaceId,
            {
                $push: {
                    tables: table._id,
                },
            },
            { new: true }
        );
        console.log("updated");
        console.log(updated);
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
export const editTable = async (req, res) => {
    const { name, seats, tableId, restId } = req.body;
    try {
        await TableModel.findByIdAndUpdate(tableId, { name, seats });
        req.io.emit(`refresh-rest-${restId}`);
        return res.status(202).json({});
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
    
};

/*
need permission check!!!!!

 */
export const deleteTable = async (req, res) => {
    try {
        const { tableId } = req.query;
        const restId = req.params.id;
        await TableModel.findByIdAndUpdate(tableId, { is_active: false });
        req.io.emit(`refresh-rest-${restId}`);
        return res.status(200).json({});
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};
