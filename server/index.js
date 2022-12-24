import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import userRouter from "./routes/user.js";
import restaurantRouter from "./routes/restaurant.js";
import dynamicLinkRouter from './routes/dynamicLink.js'
import dotenv from "dotenv";
import { mailer } from "./libs/mailer.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/user", userRouter);
app.use("/restaurant", restaurantRouter);
app.use("/verify", dynamicLinkRouter);
//mailer();
const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));
