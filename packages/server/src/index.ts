import { Server } from 'socket.io';

const io = new Server();

io.on('connection', (socket) => {
	socket.on('message', async (chatId: string, message: string) => {
		socket.join(chatId);
		socket.to(chatId).emit('message', message);
	});
});

io.listen(3000);

console.log('Server is listening');
