import jwt from "jsonwebtoken";

export function createJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}