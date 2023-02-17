import { 
  ALREADY_ACTIVE_APPLICATION_2_CLIENT, 
  APPLICATION_TYPE_1, 
  APPLICATION_TYPE_2 
} from "./constants.js";
import { generateId } from "./id-service.js";

const activeApplication1Clients = [];
let activeApplication2Client = undefined;

export function addNewApplication1Client() {
  console.log(`[${APPLICATION_TYPE_1}] joined`);

  const clientId = generateId();
  activeApplication1Clients.push(clientId);
  return clientId;
}

export function addNewApplication2Client() {
  if(activeApplication2Client !== undefined) {
    throw new Error(ALREADY_ACTIVE_APPLICATION_2_CLIENT);
  }

  console.log(`[${APPLICATION_TYPE_2}] joined`);

  const clientId = generateId();
  activeApplication2Client = clientId;
  return clientId;
}

export function removeClient(clientIdToRemove) {
  if(isApplication2Client(clientIdToRemove)) {
    removeApplication2Client();
  } else {
    removeApplication1Client(clientIdToRemove);
  }
}

function isApplication2Client(clientId) {
  return activeApplication2Client !== undefined && clientId === activeApplication2Client;
}

function removeApplication2Client() {
  console.log(`[${APPLICATION_TYPE_2}] disconnected`);
  activeApplication2Client = undefined;
}

function removeApplication1Client(clientIdToRemove) {
  const clientIndex = activeApplication1Clients.findIndex(clientId => clientId === clientIdToRemove);
  if(clientIndex === -1) {
    console.error(`Unknown client id ${clientIdToRemove}`);
    return;
  }

  console.log(`[${APPLICATION_TYPE_1}] disconnected`);
  activeApplication1Clients.splice(clientIndex, 1);
}

export function listAllActiveApplication1Clients() {
  console.log(`[${APPLICATION_TYPE_2}] asked for active ${APPLICATION_TYPE_1} client list`);
  return [...activeApplication1Clients];
}