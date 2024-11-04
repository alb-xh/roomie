import { Server } from 'socket.io';

import { config } from './config.js';

const io = new Server();

// ADD validation
io.on('connection', (socket) => {
	socket.on('join', (chatId) => {
		if (!socket.rooms.has(chatId)) {
			socket.join(chatId);
		}
	});

	socket.on('message', async (chatId, message: { from: string; content: string }) => {
		if (socket.rooms.has(chatId)) {
			socket.to(chatId).emit('message', message);
		}
	});
});

io.listen(config.getPort());

console.log('Server is listening');
