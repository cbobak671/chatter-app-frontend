import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object

const URL = "https://chatter-application-f0e5633242b6.herokuapp.com"
console.log(process.env.NODE_ENV)

export const socket = io(URL);
