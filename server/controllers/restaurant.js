import restaurantModel from "../models/restaurant.js";
import restPermissionModel from "../models/restPermission.js";
import userModel from "../models/user.js";
import mongoose from "mongoose";
import moment from "moment";

import SpaceModel from "../models/space.js";

export const createRestaurant = async (req, res) => {
    if (!(req.user.global_permission & process.env.G_CREATE_RESTAURANT)) {
        req.io.to(Object.keys(req.users).find((key) => req.users[key] === req.userId)).emit("refresh-user");
        return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
    }
    try {
        const space = await SpaceModel.create({});
        const restaurant = await restaurantModel.create({ name: req.body.name, owner: req.userId, spaces: [space._id] });
        const restperm = await restPermissionModel.create({ restaurant_id: restaurant._id, user_id: req.userId, permission: process.env.R_OWNER });
        let permissions = restaurant.permissions;
        permissions.push(restperm._id);
        await restaurantModel.findByIdAndUpdate(restaurant._id, { permissions });
        const restaurants = Array.isArray(req.user.restaurants) ? req.user.restaurants : [];
        restaurants.push(restaurant._id);
        permissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];
        permissions.push(restperm._id);
        await userModel.findByIdAndUpdate(req.userId, { permissions, restaurants });
        req.io.to(Object.keys(req.users).find((key) => req.users[key] === req.userId)).emit("refresh-rests");
        return res.status(201);
    } catch (error) {
        console.log("error:")
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};
export const deleteRestaurant = async (req, res) => {};
export const getRestaurants = async (req, res) => {
    const user = await userModel.findById(req.userId).populate("restaurants");
    return res.status(200).json(user.restaurants);
};
export const getRestaurant = async (req, res) => {
    let id;
    try {
        id = new mongoose.Types.ObjectId(req.params.id);
    } catch (error) {
        return res.status(404).json({ error: "Hibás étterem id" });
    }
    if (req.user.restaurants.includes(id)) {
        const restaurant = (await restaurantModel.findById(req.params.id).populate("spaces")).toObject();
        delete restaurant.permissions;
        delete restaurant.users;
        const restPermission = await restPermissionModel.findOne({ user_id: req.userId, restaurant_id: req.params.id });
        restaurant.permission = restPermission.permission.toNumber();
        return res.status(200).json({ restaurant });
    } else return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
    /*  console.log(await userModel.findById("63a8f801a3488f68f073fcb5").populate("restaurants"));
    const test = new mongoose.Types.ObjectId("63a8f801a3488f68f073fcb5");
    req.user.restaurants[0] = req.user.restaurants[0].toString();
    console.log(test); */
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
export const getGlobals = async (req, res) =>{
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const setGlobal = async (req, res) =>{
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const getOpeningHour = async (req, res) =>{
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const editOpeningHour = async (req, res) =>{
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const getTables = async (req, res) =>{
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const createTable = async (req, res) =>{
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const editTable = async (req, res) =>{
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const deleteTable = async (req, res) =>{
    return res.status(501).json({ error: "Nincs elkészítve" });
};