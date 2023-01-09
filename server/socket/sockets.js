//used for checking but it's all. if needed then later will use for other things

/* import TypingController from "./controllers/TypingController.js";
import RoomController from "./controllers/RoomController.js";
import MessageController from "./controllers/MessageController.js"; */

import { getEmailFromToken } from "../features/lib.js";

const sockets = (socket) => {
    /* const typingController = new TypingController(socket);
    const roomController = new RoomController(socket);
    const messageController = new MessageController(socket);
    socket.on("send-message", messageController.sendMessage);
    socket.on("typing-started", typingController.typingStarted);
    socket.on("join-room", roomController.joinRoom);
    socket.on("new-room-created", roomController.newRoomCreated);
    socket.on("room-removed", roomController.roomRemoved);
    socket.on("typing-stoped", typingController.typingStoped);
    socket.on("disconnect", typingController.disconnect); */
    socket.on("asd", (socket) => {
        console.log(socket);
    });
    socket.on("disconnect", function () {
        delete socket.users[socket.id];
    });
    console.log(`A user connected with socketId of "${socket.id}" and ${getEmailFromToken(socket.handshake.auth.token)}`);
};
export default sockets;
