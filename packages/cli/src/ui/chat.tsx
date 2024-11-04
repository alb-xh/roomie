import { exit } from 'process';
import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { Alert, Spinner } from '@inkjs/ui';
import TextInput from 'ink-text-input';

import { colors } from './constants.js';
import { Socket } from 'socket.io-client';

export enum Status {
	Connecting,
	Connected,
	Disconnected,
}
export type Message = { from: string; content: string };
export type Props = { from: string; chatId: string; socket: Socket };

export const Chat = ({ chatId, from, socket }: Props): React.ReactNode => {
	const [status, setStatus] = useState(Status.Connecting);
	const [messages, setMessages] = useState<Message[]>([]);
	const [content, setContent] = useState('');

	useEffect(() => {
		socket.connect();
	}, []);

	const handleConnectionFailure = () => {
		if (!socket.active) {
			setStatus(Status.Disconnected);
		}
	};

	const handleConnect = () => {
		setStatus(Status.Connected);
		socket.emit('join', chatId);
	};

	const handleNewMessage = (message: Message) => {
		setMessages([...messages, message].slice(-30));
	};

	const handleChange = (newContent: string) => {
		if (newContent.length < 88) {
			setContent(newContent);
		}
	};

	const handleSubmit = () => {
		if (content.length > 0) {
			const message = { from, content };

			socket.emit('message', chatId, message);
			handleNewMessage(message);
			setContent('');
		}
	};

	socket.on('connect_error', handleConnectionFailure);
	socket.on('disconnect', handleConnectionFailure);
	socket.on('connect', handleConnect);
	socket.on('message', handleNewMessage);

	if (status === Status.Disconnected) {
		setTimeout(exit, 1000);

		return <Alert variant="error">Unexpected connection issue</Alert>;
	}

	if (status === Status.Connecting) {
		return <Spinner label="Connecting" />;
	}

	return (
		<Box flexDirection="column" justifyContent="center" alignItems="center">
			<Box width={100} height={32} borderStyle="round" flexDirection="column" paddingX={4}>
				{messages.map((message, i) => (
					<Text key={i}>{`${message.from}: ${message.content}`}</Text>
				))}
			</Box>
			<Box width={100} paddingX={5} height={3} borderStyle="round" flexDirection="column">
				<TextInput placeholder="message" focus={true} value={content} onChange={handleChange} onSubmit={handleSubmit} />
			</Box>
		</Box>
	);
};
