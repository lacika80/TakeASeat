import restaurantModel from "../models/restaurant.js";
import restPermissionModel from "../models/restPermission.js";
import userModel from "../models/user.js";

export const createRestaurant = async (req, res) => {
    if (!(req.user.global_permission & process.env.G_CREATE_RESTAURANT)) {
        req.io.to(Object.keys(req.users).find((key) => req.users[key] === req.userId)).emit("refresh-user");
        return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
    }
    try {
        const restaurant = await restaurantModel.create({ name: req.body.name, owner: req.userId });
    const restperm = await restPermissionModel.create({ restaurant_id: restaurant._id, user_id: req.userId, permission: process.env.R_OWNER });
    let permissions = restaurant.permissions;
    permissions.push(restperm._id);
    await restaurantModel.findByIdAndUpdate(restaurant._id, { permissions });
    const restaurants = Array.isArray(req.user.restaurants) ? req.user.restaurants : [];
    restaurants.push(restaurant._id);
    permissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    permissions.push(restperm._id)
    await userModel.findByIdAndUpdate(req.userId, { permissions, restaurants });
    req.io.to(Object.keys(req.users).find((key) => req.users[key] === req.userId)).emit("refresh-rests");
    return res.status(201);
    } catch (error) {
        return res.status(500).json({ error: "Valami félrement" });
    }
    

};
export const deleteRestaurant = async (req, res) => {};
export const getRestaurants = async (req, res) => {
    const user = await userModel.findById(req.userId).populate('restaurants')
    return res.status(200).json(user.restaurants);
};
export const getRestaurant = async (req, res) => {};
export const updateRestaurant = async (req, res) => {};
