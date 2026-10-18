import { io } from 'socket.io-client';
const URL = process.env.REACT_APP_BACKEND_URL || (process.env.NODE_ENV === 'production' ? undefined : `http://${window.location.hostname}:3500`);
export const socket = io(URL, { autoConnect: false });
