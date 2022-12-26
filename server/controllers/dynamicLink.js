import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../models/user.js";
import DynamicLinkModel from "../models/dynamicLink.js";
dotenv.config();

export const useLink = async (req, res) => {
    const link = await getDyniamicLink(req.body.token);
   
    const { password, confirmPassword } = req.body;
    if (!(await tokenIsValid(link))) return res.status(405).json({ error: "Token nem érvényes" });
    switch (link.type) {
        case 1:
            try {
                await verifyLink(link);
                return res.status(200).json({ message: "Sikeres érvényesítés" });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Valami félrement" });
            }
            break;
        case 2:
            if (!password || !confirmPassword || password != confirmPassword) return res.status(400).json({ error: "Jelszó nem megfelelő" });
            try {
                await resetPasswordLink(link, password);
                return res.status(200).json({ message: "Sikeres Jelszó változtatás" });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Valami félrement" });
            }

            break;

        default:
            return res.status(405).json({ error: "Hibás token" });
            break;
    }
};
const resetPasswordLink = async (link, password) => {
    await UserModel.findByIdAndUpdate(link.receiver_id, { password: await bcrypt.hash(password, 12) }, { new: true });
    await DynamicLinkModel.findByIdAndUpdate(link._id, { date_of_used: new Date() }, { new: true });
};
export const getDyniamicLink = async (token) => {
    const link = await DynamicLinkModel.findOne({ link: token });
    return link;
};
export const tokenIsValid = async (link) => {
    if (!link) return false;
    const date = new Date();
    if (date > link.date_valid_until || link.date_of_used) return false;
    return true;
};
const verifyLink = async (link) => {
    const date = new Date();
    await UserModel.findByIdAndUpdate(link.receiver_id, { is_verified: true, global_permission: 1 }, { new: true });
    await DynamicLinkModel.findByIdAndUpdate(link._id, { date_of_used: date }, { new: true });
};

export const getEmailFromLink = async (req, res) => {
    if (!req.query.token) return res.status(405).json({ error: "Hibás token" });
    const link = await getDyniamicLink(req.query.token);
    return res.status(200).json({ email: link.email, is_valid: await tokenIsValid(link) });
};
