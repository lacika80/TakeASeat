import dotenv from "dotenv";
import UserModel from "../models/user.js";

dotenv.config();

export const getAllUser = async (req, res) => {
    if (!(req.user.global_permission & process.env.G_LIST_USERS)) return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
    let users = await UserModel.find();
    return res.status(200).json({ users });
};
export const modifyGPerm = async (req, res) => {
    if (!(req.user.global_permission & process.env.G_LIST_USERS)) {
        req.io.to(req.body.socketId).emit("refresh-g-users");
        return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
    }
    //if (!(req.user.global_permission & req.body.perm)){req.io.to(req.body.socketId).emit("refresh-g-users"); return res.status(405).json({ error: "Nincs ehhez jogosultságod" })};
    const user = await UserModel.findById(req.body.id);
    let { global_permission } = user;
    global_permission = parseInt(global_permission);
    switch (req.body.type) {
        case "add":
            if (!(user.global_permission & req.body.perm)) global_permission += parseInt(req.body.perm);
            else {
                req.io.to(req.body.socketId).emit("refresh-g-users");
                return res.status(405).json({ error: "Nem végrehajtható" });
            }
            await UserModel.findByIdAndUpdate(req.body.id, { global_permission });
            req.io.except(req.body.socketId).emit("refresh-g-users");
            break;
        case "remove":
            if (user.global_permission & req.body.perm) global_permission -= parseInt(req.body.perm);
            else {
                req.io.to(req.body.socketId).emit("refresh-g-users");
                return res.status(405).json({ error: "Nem végrehajtható" });
            }
            await UserModel.findByIdAndUpdate(req.body.id, { global_permission });
            req.io.except(req.body.socketId).emit("refresh-g-users");
            break;
        default:
            break;
    }
    return res.status(202).json();
};
