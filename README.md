# Components

## Application1

- Application 1 is a .net 6 / C# / Avalonia UI project
- Application 1 is a client as a windows application 
- Application 1 can send its inputs to Application 2 clients
- Application 1 can receive inputs from Application 2 clients and can display them
- There can be multiple active Application 1 clients at the same time

## Application2

- Application 2 is a node.js / JavaScript / Express / React project
- Application 2 is a web application consisting of two components, the frontend and backend
- The frontend is a client that can send its inputs to all Application 1 clients or to a certain client
- The frontend can alos receive the inputs of all Application 1 clients and can display them
- The frontend also shows a list of all connected Application 1 clients
- There can only be one active Application 2 client at the same time
- The backend is for serving the frontend and exchanging and authenticating messages between Application 1 and Application 2 clients via websockets

# Communication

## Overview

- The Application 1 and Application 2 clients are communicating through the backend of Application 2
- The clients connect to the backend through websockets
- The Application 1 and Application 2 are using the Socket.IO library for handling the websockt communication
- Each client needs to 'join' first, to receive a client id and JWT for further message authentication
- Each JWT contains the clientId and the type of client (Application1 or Application2 client), so that the backend knows which client has send the message, without having to rely on the socket id of Socket.IO
- Application 1 clients can use join without credentials, but Application 2 clients need to send credentials to be able to join

## Messages

### Application 1 Messages

|Name                | Parameters                | Description                                                                                                          |
|--------------------|---------------------------|----------------------------------------------------------------------------------------------------------------------|
| application1-join  | None                      | Sending a request to the backend of Application2 to join as a Application 1 client and receive a client id and a JWT |
| application1-input | input: string; auth: JWT; | Application1 sending its input to Application2 clients                                                               |

### Application 2 Frontend Messages 


|Name                              | Parameters                                  | Description                                                                                                    |
|----------------------------------|---------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| application2-join                | apiKey: string;                             | Sending a request to the backend of Application2 to join as as Application 2 and receive a client id and a JWT |
| application2-input-broadcast     | input: string; auth: JWT;                   | Application2 sending its input to all Application2 clients                                                     |
| application2-input-single-client | clientId: string; input: string; auth: JWT; | Application2 sending its input to a certain Application 1 client defined by the clientId                       |
| list-active-clients              | auth: JWT;                                  | Asking for all currently active clients                                                                        |

### Application 2 Backend Messages


|Name                    | Parameters                        | Description                                                           |
|------------------------|-----------------------------------|-----------------------------------------------------------------------|
| client-join-success    | clientId: string; auth: JWT;      | Returning the clientId and JWT for the successfully joined client     |
| client-join-error      | error: string;                    | The reason why a client could not successfully join                   |
| application1-output    | output: string; senderId: string; | Sending the Application 2 Input to the Application 1 client as output |
| application2-output    | output: string; senderId: string; | Sending the Application 1 Input to the Application 2 client as output |
| active-clients-success | Array (clientId: string)          | Sending an array of all currently active clients                      |
| active-clients-error   | error: string                     | Requesting all active clients failed, sending the reason for it       |

# Client Id

- Each Client gets a client id assigned upon joining
- The client id is a string consisting of two componentes seperated by a '-'
	- The first component is the current timestamp in millisecons since the epoch
	- The second component are randomly generated 32 bits as a hexstring
	- Example: 1676540597453-f836588b

# How to Run

## Application 1

- Requierments:
    - .net SDK Version 6
- How to run:
    - Navigate into the Application1 folder
    - Run 'dotnet run'
    - A windows application window should now be open

## Application 2

### Docker

Application2 provides a Dockerfile that can be used to run it inside of a container.

- Requierements:
    - Docker engine needs to be installed on the host system
- How to run:
    - Navigate to the folder Application2
    - Create a .env file for the application settings, the .sample.env file can be used as an example
    - Build the image first e.g.: 'docker build -t application2'
    - Run the image and map the container port 3000 to the host port 3000 e.g.: 'docker run -p3000:3000 application2', make sure the host port 3000 is available
    - The webapp should now be available under http://localhost:3000

### On the host machine

Application2 can also be run directly on the host as a node.js application.

- Requierements:
    - node.js version 18
    - npm version 9
- How to Run:
    - Navigate to the folder Application2
    - Create a .env file for the application settings, the .sample.env file can be used as an example
    - Run the command 'npm install'
    - Navigate to the folder frontend
    - Run the command 'npm install'
    - Navigate back to the previous folder
    - Run the command 'npm run build'
    - Run the command 'npm run start', make sure the port 3000 is available on the host
    - The webapp should now be available under http://localhost:3000
