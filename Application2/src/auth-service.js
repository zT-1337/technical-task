import jwt from "jsonwebtoken";
import { APPLICATION_TYPE_2, INVALID_API_KEY, INVALID_JWT, MISSING_JWT, UNAUTHORIZED_CLIENT_TYPE } from "./constants";

export function createJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

export function tryToAuthenticateWithApiKey(apiKeyCredentials) {
  if(!apiKeyCredentials || !isValidApiKey(apiKeyCredentials.apiKey)) {
    console.log(`[${APPLICATION_TYPE_2}] failed to authenticate with api key`);
    throw new Error(INVALID_API_KEY);
  }
}

function isValidApiKey(apiKey) {
  return apiKey === process.env.API_KEY;
}

export function tryToAuthorize(messageWithToken, allowedClientType) {
  if(!messageWithToken || !messageWithToken.auth) {
    console.log(`[application] failed to provide jwt in message`);
    throw new Error(MISSING_JWT);
  }

  let payload;
  try {
    payload = jwt.verify(messageWithToken, process.env.JWT_SECRET);
  } catch (error) {
    console.log(`[${allowedClientType}] sent invalid jwt`);
    throw new Error(INVALID_JWT);
  }

  if(payload.type !== allowedClientType) {
    console.log(`[${payload.type}] has not the allowed client type`);
    throw new Error(UNAUTHORIZED_CLIENT_TYPE);
  }
}