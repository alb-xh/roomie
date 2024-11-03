import { io, Socket } from 'socket.io-client';

import { config } from '../config';

export const socket: Socket = io(config.getServerUrl(), { autoConnect: false });
