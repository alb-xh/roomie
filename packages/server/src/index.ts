import { Server } from 'socket.io';

import { config } from './config';

const io = new Server();

io.on('connection', (socket) => {
	socket.on('message', async (chatId: string, message: string) => {
		socket.join(chatId);
		socket.to(chatId).emit('message', message);
	});
});

io.listen(config.getPort());

console.log('Server is listening');
