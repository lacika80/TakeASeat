import dotenv from "dotenv";
import { CreateSocketList } from "../features/lib.js";
import UserModel from "../models/user.js";

dotenv.config();

export const getAllUser = async (req, res) => {
    if (!(req.user.global_permission & process.env.G_LIST_USERS)) return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
    let users = await UserModel.find();
    return res.status(200).json({ users });
};
//change global permission
export const modifyGPerm = async (req, res) => {
    //if you haven't permission for this then gives a command for the client to refresh the userlist, after refresh the user.
    if (!(req.user.global_permission & process.env.G_LIST_USERS)) {
        req.io.to(req.body.socketId).emit("refresh-g-users");
        req.io.to(req.body.socketId).emit("refresh-user");
        return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
    }
    //if you haven't a permission then you cannot change this for another person - later will integrated
    //if (!(req.user.global_permission & req.body.perm)){req.io.to(req.body.socketId).emit("refresh-g-users"); return res.status(405).json({ error: "Nincs ehhez jogosultságod" })};
    const user = await UserModel.findById(req.body.id);
    let { global_permission } = user;
    global_permission = parseInt(global_permission);
    const socketList = CreateSocketList(req.users, req.body.id);
    switch (req.body.type) {
        case "add":
            //in case if in this time the user gets the permission when this runs then not give 2times.
            if (!(user.global_permission & req.body.perm)) global_permission += parseInt(req.body.perm);
            else {
                req.io.to(req.body.socketId).emit("refresh-g-users");
                return res.status(405).json({ error: "Nem végrehajtható" });
            }
            await UserModel.findByIdAndUpdate(req.body.id, { global_permission });
            //refresh the list for everybody who on the userlist page to know this permission is changed
            req.io.except(req.body.socketId).emit("refresh-g-users");
            //if the user is logged in then refresh the user to know the new permission
            if (socketList) req.io.to(socketList).emit("refresh-user");
            break;
        case "remove":
            //reverse check
            if (user.global_permission & req.body.perm) global_permission -= parseInt(req.body.perm);
            else {
                req.io.to(req.body.socketId).emit("refresh-g-users");
                return res.status(405).json({ error: "Nem végrehajtható" });
            }
            await UserModel.findByIdAndUpdate(req.body.id, { global_permission });
            //refresh the list for everybody who on the userlist page to know this permission is changed
            req.io.except(req.body.socketId).emit("refresh-g-users");
            //if the user is logged in then refresh the user to know the new permission
            if (socketList) req.io.to(socketList).emit("refresh-user");
            break;
        default:
            break;
    }
    return res.status(202).json();
};

/*
implementation guide in hungary:

 */
export const getGlobalRestaurants = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};
