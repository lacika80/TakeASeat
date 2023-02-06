import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

import dotenv from "dotenv";
dotenv.config();
const secret = process.env.SECRET;
//checkes the user's given token
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, secret);
      console.log(decodedData);
      req.user = await UserModel.findOne({ _id: decodedData?.id }).lean();
      req.userId = req.user._id.toString();
      console.log(req.userId);
      
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }    

    next();
  } catch {
    return res.status(403).json({ error: "Token nem érvényes" });
  }
};
//middleware helper. used in the socket's handshake
export const getIdFromToken = (token) =>{
  const decodedData = jwt.verify(token, secret);
  return Promise.resolve(decodedData.id);
}

export default auth;
