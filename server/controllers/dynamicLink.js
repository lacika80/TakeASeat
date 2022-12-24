import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../models/user.js";
import DynamicLinkModel from "../models/dynamicLink.js";
import { exit } from "process";
dotenv.config();

export const useLink = async (req, res) => {
    const link = await getDyniamicLink(req.query.token);
    if (!(await tokenIsValid(link))) 
        return res.status(400).json({ message: "Token nem érvényes" });
    switch (link.type) {
        case 1:
            try {
                await verifyLink(link);
                return res.status(200).json({ message: "Sikeres érvényesítés" });
            } catch (error) {
                return res.status(500).json({ message: "Something went wrong" });
                console.log(error);
            }

            break;

        default:
            return res.status(400).json({ message: "Hibás token" });
            break;
    }
};
const getDyniamicLink = async (token) => {
    const link = await DynamicLinkModel.findOne({ link: token });
    return link;
};
const tokenIsValid = async (link) => {
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
