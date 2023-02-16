import { createJWT } from "./auth-service.js";
import { APPLICATION_TYPE_1 } from "./constants.js";
import { generateId } from "./id-service.js";

const activeApplication1Clients = [];

export function addNewApplication1Client() {
  const clientId = generateId();
  const auth = createJWT({clientId, type: APPLICATION_TYPE_1});
  activeApplication1Clients.push(clientId);

  console.log(`[${APPLICATION_TYPE_1}] joined`)
  console.log(`Active Application1 clients: ${activeApplication1Clients}`);
  return {clientId, auth};
}

export function removeClient(clientIdToRemove) {
  const clientIndex = activeApplication1Clients.findIndex(clientId => clientId === clientIdToRemove);
  if(clientIndex === -1) {
    console.error(`Unknown client id ${clientIdToRemove}`);
    return;
  }

  activeApplication1Clients.splice(clientIndex, 1);
  console.log(`[${APPLICATION_TYPE_1}] disconnected`);
  console.log(`Active Application1 clients: ${activeApplication1Clients}`);
}