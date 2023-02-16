import jwt from "jsonwebtoken";

export function createJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

export function isValidApiKey(apiKey) {
  return apiKey === process.env.API_KEY;
}