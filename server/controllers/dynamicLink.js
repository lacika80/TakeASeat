import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment";

import UserModel from "../models/user.js";
import DynamicLinkModel from "../models/dynamicLink.js";
import { CreateSocketList } from "../features/lib.js";
dotenv.config();

//token using landing func
export const useLink = async (req, res) => {
    const link = await getDyniamicLink(req.body.token);

    const { password, confirmPassword } = req.body;
    if (!(await tokenIsValid(link))) return res.status(405).json({ error: "Token nem érvényes" });
    console.log(link);
    switch (link.type) {
        case parseInt(process.env.DYNAMIC_LINK_VERIFY_EMAIL):
            try {
                await UserModel.findByIdAndUpdate(link.receiver_id, { is_verified: true });
                await DynamicLinkModel.findByIdAndUpdate(link._id, { date_of_used: moment() });
                const socketList = CreateSocketList(req.users, req.userId);
                if (socketList) req.io.to(socketList).emit("refresh-user");
                return res.status(200).json();
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Valami félrement" });
            }
        case parseInt(process.env.DYNAMIC_LINK_FORGOTTENPW_EMAIL):
            if (!password || !confirmPassword || password != confirmPassword) return res.status(400).json({ error: "Jelszó nem megfelelő" });
            try {
                await UserModel.findByIdAndUpdate(link.receiver_id, { password: await bcrypt.hash(password, 12) });
                await DynamicLinkModel.findByIdAndUpdate(link._id, { date_of_used: moment() });
                return res.status(200).json({ message: "Sikeres Jelszó változtatás" });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Valami félrement" });
            }
        default:
            return res.status(405).json({ error: "Hibás token" });
    }
};

//gives back the full data modell with the given token
export const getDyniamicLink = async (token) => {
    const link = await DynamicLinkModel.findOne({ link: token });
    return link;
};
//token check
export const tokenIsValid = async (link) => {
    if (!link) return false;
    const date = new Date();
    if (date > link.date_valid_until || link.date_of_used) return false;
    return true;
};

//gets the datas from the given token and return back
export const getEmailFromLink = async (req, res) => {
    if (!req.query.token) return res.status(405).json({ error: "Hibás token" });
    const link = await getDyniamicLink(req.query.token);
    return res.status(200).json({ email: link.email, is_valid: await tokenIsValid(link) });
};

export const emailCreated = async (req, res) => {
    try {
        if (req.user.is_verified) {
            const socketList = CreateSocketList(req.users, req.userId);
            if (socketList) req.io.to(socketList).emit("refresh-user");
            return res.status(400).json({ error: "A felhasználó email címe már érvényesítve van." });
        }
        const link = await DynamicLinkModel.findOne({ receiver_id: req.user._id, date_of_used: { $exists: false } });
        return res.status(200).json({ CreatedAt: link.date_of_created });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};
