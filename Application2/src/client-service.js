import { createJWT, isValidApiKey } from "./auth-service.js";
import { ALREADY_ACTIVE_APPLICATION_2_CLIENT, APPLICATION_TYPE_1, APPLICATION_TYPE_2, INVALID_API_KEY } from "./constants.js";
import { generateId } from "./id-service.js";

const activeApplication1Clients = [];
let activeApplication2Client = undefined;

export function addNewApplication1Client() {
  const clientId = generateId();
  const auth = createJWT({clientId, type: APPLICATION_TYPE_1});
  activeApplication1Clients.push(clientId);

  console.log(`[${APPLICATION_TYPE_1}] joined`)
  console.log(`Active Application1 clients: ${activeApplication1Clients}`);
  return {clientId, auth};
}

export function addNewApplication2Client(credentials) {
  if(!credentials || !isValidApiKey(credentials.apiKey)) {
    return INVALID_API_KEY;
  }

  if(activeApplication2Client !== undefined) {
    return ALREADY_ACTIVE_APPLICATION_2_CLIENT;
  }

  const clientId = generateId();
  const auth = createJWT({clientId, type: APPLICATION_TYPE_2});
  activeApplication2Client = clientId;

  console.log(`[${APPLICATION_TYPE_2}] joined`)
  console.log(`Active Application2 client: ${activeApplication2Client}`);
  return {clientId, auth};
}

export function removeClient(clientIdToRemove) {
  if(clientIdToRemove === activeApplication2Client) {
    activeApplication2Client = undefined;
    console.log(`[${APPLICATION_TYPE_2}] disconnected`);
    console.log(`Active Application2 clients: ${activeApplication2Client}`);
    return;
  }

  const clientIndex = activeApplication1Clients.findIndex(clientId => clientId === clientIdToRemove);
  if(clientIndex === -1) {
    console.error(`Unknown client id ${clientIdToRemove}`);
    return;
  }

  activeApplication1Clients.splice(clientIndex, 1);
  console.log(`[${APPLICATION_TYPE_1}] disconnected`);
  console.log(`Active Application1 clients: ${activeApplication1Clients}`);
}