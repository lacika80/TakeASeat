import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

import userRouter from "./routes/user.js";
import restaurantRouter from "./routes/restaurant.js";
import dynamicLinkRouter from "./routes/dynamicLink.js";
import adminRouter from "./routes/admin.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import sockets from "./socket/sockets.js";
import { getIdFromToken } from "./middleware/auth.js";

const app = express();
dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: ["http://localhost:3000"] } });
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const activeUsers = {};
//after the handshake the new socket with id will put in the activeUsers object.
io.use((socket, next) => {
    getIdFromToken(socket.handshake.auth.token).then((data) => {
        if (socket.id && data) activeUsers[socket.id] = data;
    });

    socket.users = activeUsers;
    next();
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
io.on("connection", sockets);
//added the socket and the activeUsers to the express
app.use((req, res, next) => {
    req.io = io;
    req.users = activeUsers;
    return next();
});
//i dont really know these 2. just that this will comes good in file uploading
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//routes
app.use("/user", userRouter);
app.use("/restaurant", restaurantRouter);
app.use("/verify", dynamicLinkRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 5000;

//database connecting
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => httpServer.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));
