import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../models/user.js";
import DynamicLinkModel from "../models/dynamicLink.js";
import { createTransport } from "nodemailer";
import { getDyniamicLink, tokenIsValid } from "./dynamicLink.js";
import moment from 'moment';
dotenv.config();

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(404).json({ error: "Felhasználó nem létezik" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(400).json({ error: "Érvénytelen azonosítási adatok" });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET, { expiresIn: "24h" });

        res.status(200).json({ result: user, token });
    } catch (err) {
        res.status(500).json({ error: "Valami félrement" });
    }
};

export const signup = async (req, res) => {
    const { email, password, first_name, last_name, invite_token } = req.body;
    try {
        if (!invite_token) {
            const oldUser = await UserModel.findOne({ email });

            if (oldUser) return res.status(400).json({ error: "Felhasználó már létezik ezzel az email címmel" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        let result;
        if (!invite_token) {
            result = await UserModel.create({ email, password: hashedPassword, first_name, last_name });
            await createEmail(result, process.env.DYNAMIC_LINK_VERIFY_EMAIL);
        } else {
            const link = getDyniamicLink(invite_token);
            if (!tokenIsValid(link)) return res.status(400).json({ error: "Token nem érvényes" });
            result = await UserModel.create({ email, password: hashedPassword, first_name, last_name, is_verified: true, global_permission: link.global_permission });
        }

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET, { expiresIn: "24h" });

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ error: "Valami félrement" });

        console.log(error);
    }
};

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
const createEmail = async (user, type) => {
    let link = crypto.randomBytes(32).toString("hex");

    let result;
    let mailOptions;

    switch (type) {
        case process.env.DYNAMIC_LINK_VERIFY_EMAIL:
            console.log(moment().add(1, 'd'));
            result = await DynamicLinkModel.create({ type, receiver_id: user._id, email: user.email, date_valid_until: moment().add(1, 'd'), link });

            mailOptions = {
                to: user.email,
                subject: "Üdvözlöm önt a Take-A-Seat-en",
                text: `Kérem érvényesíte az e-mail címét az alábbi link segítségével: ${process.env.CLIENT_URL + ":" + process.env.CLIENT_PORT + "/verify?token=" + link}`,
            };
            break;

        case process.env.DYNAMIC_LINK_FORGOTTENPW_EMAIL:
            result = await DynamicLinkModel.create({ type, receiver_id: user._id, email: user.email, date_valid_until: moment().add(1, 'h'), link });

            mailOptions = {
                to: user.email,
                subject: "Take-A-Seat Új jelszó beállítása",
                text: `Az alábbi link segítségével új jelszót állíthat be: ${process.env.CLIENT_URL + ":" + process.env.CLIENT_PORT + "/newpassword?token=" + link}`,
            };
            break;

        default:
            break;
    }

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
