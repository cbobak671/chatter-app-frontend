import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'localhost:3000';
console.log(process.env.NODE_ENV)

export const socket = io(URL);