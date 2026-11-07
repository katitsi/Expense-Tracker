import jwt from "jsonwebtoken";
import { findUserById } from "../services/user.js";

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);
    req.user = {
      id: user.user_id,
      username: user.username,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Not autherized, token failed!" });
  }
};

export default protect;
