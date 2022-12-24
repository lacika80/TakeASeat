import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../models/user.js";
import DynamicLinkModel from '../models/dynamicLink.js'
import { createTransport } from "nodemailer";
dotenv.config();

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET, { expiresIn: "24h" });

        res.status(200).json({ result: user, token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    try {
        const oldUser = await UserModel.findOne({ email });

        if (oldUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await UserModel.create({ email, password: hashedPassword, first_name, last_name });

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET, { expiresIn: "24h" });

        await createVerifyEmail(result);
        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });

        console.log(error);
    }
};
const createVerifyEmail = async (user) => {
    let link = crypto.randomBytes(32).toString("hex");
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const result = await DynamicLinkModel.create({ type: process.env.DYNAMIC_LINK_VERIFY_EMAIL, receiver_id: user._id, email: user.email,  date_valid_until: date, link});
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASSWORD,
        },
    });

    const mailOptions = {
        to: user.email,
        subject: "Üdvözlöm önt a Take-A-Seat-en",
        text: `Kérem érvényesíte az e-mail címét az alábbi link segítségével: ${process.env.SERVER_URL + ":" + process.env.PORT + "/verify?token=" + link}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};
