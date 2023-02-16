import jwt from "jsonwebtoken";

export function createJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

export function isValidApiKey(apiKey) {
  return apiKey === process.env.API_KEY;
}

export function isInputAuthorized(token, allowedType) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.type = allowedType;
  } catch (error) {
    return false;
  }
}