import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { createTransport } from "nodemailer";
import { getDyniamicLink, tokenIsValid } from "./dynamicLink.js";
import moment from "moment";

import UserModel from "../models/user.js";
import DynamicLinkModel from "../models/dynamicLink.js";
import RestPermissionModel from "../models/restPermission.js";
import RestaurantModel from "../models/restaurant.js";
import notificationModel from "../models/notification.js";
import { CreateSocketList } from "../features/lib.js";
dotenv.config();

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email }).lean().populate("last_active_rest");

        if (!user) return res.status(401).json({ error: "Hibás bejelentkezési adatok!" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(401).json({ error: "Hibás bejelentkezési adatok!" });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET, { expiresIn: "24h" });
        user.id = user._id;
        delete user._id;
        delete user.password;
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({ error: "Valami félrement" });
    }
};
//alias user check
export const relogin = async (req, res) => {
    const token = jwt.sign({ email: req.user.email, id: req.user._id }, process.env.SECRET, { expiresIn: "24h" });
    res.status(200).json({ user: req.user, token });
};
//registration
export const signup = async (req, res) => {
    const { email, password, confirmPassword, first_name, last_name, invite_token } = req.body;
    try {
        if (!invite_token) {
            const oldUser = await UserModel.findOne({ email });

            if (oldUser) return res.status(400).json({ error: "Felhasználó már létezik ezzel az email címmel" });
        }
        if (password != confirmPassword) return res.status(400).json({ error: "A 2 jelszó nem azonos" });
        const hashedPassword = await bcrypt.hash(password, 12);
        let result;
        if (!invite_token) {
            result = await UserModel.create({ email, password: hashedPassword, first_name, last_name });

            await createEmail(result, process.env.DYNAMIC_LINK_VERIFY_EMAIL);
        } else {
            const link = getDyniamicLink(invite_token);
            if (!tokenIsValid(link)) return res.status(400).json({ error: "Token nem érvényes" });
            result = await UserModel.create({ email, password: hashedPassword, first_name, last_name, is_verified: true, global_permission: (link.global_permission ??= 1) });
        }
        result = result.toObject();
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET, { expiresIn: "24h" });
        result.id = result._id;
        delete result._id;
        delete result.password;
        //gives back the user without password for the fluent login
        res.status(201).json({ user: result, token });
    } catch (error) {
        res.status(500).json({ error: "Valami félrement" });
        console.log(error);
    }
};
//gives an email with token for password reset
export const forgottenpw = async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "Felhasználó nem létezik" });
    try {
        createEmail(user, process.env.DYNAMIC_LINK_FORGOTTENPW_EMAIL);
        return res.status(200).json({ message: "Email elküldve" });
    } catch (error) {
        res.status(500).json({ error: "Valami félrement" });

        console.log(error);
    }
};

export const setActiveRest = async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate(req.userId, { last_active_rest: req.params.resId });
        return res.status(201);
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};
export const recreateVerifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        let user = req.user;
        if (req.user.email != email) {
            console.log(`email: ${email}, id: ${req.user._id}`);
            user = await UserModel.findByIdAndUpdate(req.user._id, { email }, { new: true });
            const socketList = CreateSocketList(req.users, req.userId);
            if (socketList) req.io.to(socketList).emit("refresh-user");
        }
        await DynamicLinkModel.findOneAndUpdate({ receiver_id: user._id, type: process.env.DYNAMIC_LINK_VERIFY_EMAIL, date_of_used: { $exists: false } }, { date_of_used: moment() });
        createEmail(user, process.env.DYNAMIC_LINK_VERIFY_EMAIL);
        return res.status(200).json();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
};

//this creates the email and send it
const createEmail = async (user, type, message = null) => {
    let link = crypto.randomBytes(32).toString("hex");

    let result;
    let mailOptions;

    switch (type) {
        case process.env.DYNAMIC_LINK_VERIFY_EMAIL:
            result = await DynamicLinkModel.create({ type, receiver_id: user._id, email: user.email, date_valid_until: moment().add(1, "d"), date_of_created:moment(), link });

            mailOptions = {
                to: user.email,
                subject: "Üdvözlöm önt a Take-A-Seat-en",
                text: `Kérem érvényesíte az e-mail címét az alábbi link segítségével: ${process.env.CLIENT_URL + ":" + process.env.CLIENT_PORT + "/verify?token=" + link}`,
            };
            break;

        case process.env.DYNAMIC_LINK_FORGOTTENPW_EMAIL:
            result = await DynamicLinkModel.create({ type, receiver_id: user._id, email: user.email, date_valid_until: moment().add(1, "h"), link });

            mailOptions = {
                to: user.email,
                subject: "Take-A-Seat Új jelszó beállítása",
                text: `Az alábbi link segítségével új jelszót állíthat be: ${process.env.CLIENT_URL + ":" + process.env.CLIENT_PORT + "/newpassword?token=" + link}`,
            };
            break;

        default:
            break;
    }
    await mailSender(mailOptions);
};

const mailSender = async (mailOptions) => {
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASSWORD,
        },
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

/*
implementation guide in hungary:
- ellenörzés hogy küldhet-e meghívót
- személy ellenörzése hogy már regisztrálva van-e
- Ha igen, akkor értesíté kiküldése
- Email kiküldése. Amennyiben nincs regisztrálva, úgy regisztrációs linkes, ha regisztrálva van, úgy 1 jelzőt

tud adni jogok? ha nem akkor csak global jogok lehetnek ✓
szerkesztési jogadási joga van? ha nincs akkor nem adhat jogot se szerkeszteni se jogot adni a szerkesztésre
ha tud adni jogot, akkor max akkora jogot lehet adni neki mint az őjoga+global 
 */
export const inviteToRest = async (req, res) => {
    try {
        const { email, message, permission, restaurantId } = req.body;
        const { user } = req;
        const restaurant = await RestaurantModel.findById(restaurantId).populate("global");
        const userPerm = await RestPermissionModel.findOne({ user_id: user.id, restaurant_id: restaurantId });
        /*
    basic check
    */
        if (userPerm == null || !(process.env.R_INVITE & userPerm.permission) || permission & userPerm.permission) {
            req.io.to(req.body.socketId).emit("refresh-user");
            return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
        }
        /*
    basic perm check if the user doesnt have edit permission
    */
        if (permission != restaurant.global.basicPerm && !(userPerm.permission & process.env.R_EDIT_USERS_PERMISSION)) {
            req.io.to(req.body.socketId).emit("refresh-user");
            return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
        }
        /*
    edit_user permission check
    */
        if (permission & process.env.R_EDIT_USERS_PERMISSION && !(userPerm.permission & process.env.R_PERM_TO_GIVE_EDIT_PERM) && !(restaurant.global.basicPerm & process.env.R_EDIT_USERS_PERMISSION)) {
            req.io.to(req.body.socketId).emit("refresh-user");
            return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
        }
        /*
    perm edit giving permission check
    */
        if (
            permission & process.env.R_PERM_TO_GIVE_EDIT_PERM &&
            !(userPerm.permission & process.env.R_PERM_TO_GIVE_EDIT_PERM) &&
            !(restaurant.global.basicPerm & process.env.R_PERM_TO_GIVE_EDIT_PERM)
        ) {
            req.io.to(req.body.socketId).emit("refresh-user");
            return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
        }
        /*
    check that the invited have different perms than the user can give
    */
        if (((permission | restaurant.global.basicPerm | userPerm.permission) ^ (userPerm.permission | restaurant.global.basicPerm)) > 0) {
            req.io.to(req.body.socketId).emit("refresh-user");
            return res.status(405).json({ error: "Nincs ehhez jogosultságod" });
        }

        let link = crypto.randomBytes(32).toString("hex");
        const invited = await UserModel.findOne({ email });
        if (invited == null) {
            await DynamicLinkModel.create({
                type: 3,
                sender_id: user.id,
                email: user.email,
                restaurant_id: restaurantId,
                permission,
                global_permission: 1,
                date_valid_until: moment().add(24, "h"),
                link,
            });
        } else {
            await DynamicLinkModel.create({
                type: 3,
                sender_id: user.id,
                receiver_id: invited._id,
                email: user.email,
                restaurant_id: restaurantId,
                permission,
                global_permission: 1,
                date_valid_until: moment().add(24, "h"),
                link,
            });
        }
        const text = message
            ? `Önt ${user.last_name} ${user.first_name} meghívta, hogy csatlakozzon az étterméhez!

        ${message}

        A meghívás elfogadásához kérem kattintson <a href="${process.env.CLIENT_URL + ":" + process.env.CLIENT_PORT + "/verify?token=" + link}">ide</a>`
            : `Önt ${user.last_name} ${user.first_name} meghívta, hogy csatlakozzon az étterméhez!

        A meghívás elfogadásához kérem kattintson <a href="${process.env.CLIENT_URL + ":" + process.env.CLIENT_PORT + "/verify?token=" + link}">ide</a>`;
        const mailOptions = {
            to: email,
            subject: "Meghívása érkezett a Take-A-Seat-re",
            text,
        };
        await mailSender(mailOptions);

        if (invited != null) {
            const notif = await notificationModel.create({
                message: `${user.last_name} ${user.first_name} meghívta, hogy csatlakozzon az étterméhez!`,
                acceptable: true,
                accept: `${process.env.CLIENT_URL + ":" + process.env.CLIENT_PORT + "/verify?token=" + link}`,
            });
            UserModel.findByIdAndUpdate(invited._id, { $push: { notifications: notif._id } });
        }
    } catch (error) {
        console.log("error:");
        console.log(error);
        return res.status(500).json({ error: "Valami félrement" });
    }
    const socketList = invited ? CreateSocketList(req.users, invited._id.toString()) : null;
    if (socketList) req.io.to(socketList).emit("notificaion");
    return res.status(200);
};

/*
implementation guide in hungary:

 */
export const kickFromTheRest = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const EditRestPerm = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};

/*
implementation guide in hungary:

 */
export const restUserList = async (req, res) => {
    return res.status(501).json({ error: "Nincs elkészítve" });
};
