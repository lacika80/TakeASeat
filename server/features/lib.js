import jwt from "jsonwebtoken";

export const getIdFromToken = (token) => {
    const decodedData = jwt.verify(token, process.env.SECRET);
    return decodedData.id;
};
export const getEmailFromToken = (token) => {
    const decodedData = jwt.verify(token, process.env.SECRET);
    return decodedData.email;
};

/**
 * creates array with the given user's all logged in sockets. so if the user logged in in 2 tabs in browser or idk then gives the all sockets in an array
 * @param {*} activeUsers req.users
 * @param {String} id userId
 * @returns Array filled with the given user's active socket ids 
 */
export const CreateSocketList = (activeUsers, id) => {
    let socketids = [];
    for (const key in activeUsers) {
        if (activeUsers[key] == id) socketids.push(key);
    }
    if (socketids.length == 0) return false;
    else return socketids;
};
