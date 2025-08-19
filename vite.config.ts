import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
// server code for websockets here
import { Server } from 'socket.io'; // https://www.youtube.com/watch?v=mAcKzdW5fR8 
import { state } from './server/players.ts';
import type { Question } from '$lib/index'; // Assuming PlayerData is defined in $lib/index

interface CheckAnswerPayload {
	answer: string;
	question: Question;
	socketId: string;
}
const webSocketServer = {
	name: "webSocketServer",
	configureServer(server: ViteDevServer) { // this is from vite plugin system 
		if (!server.httpServer) return; // ensure server is running
		const io = new Server(server.httpServer);
		io.on('connect', (socket) => {

			console.log('A client connected:', socket.id);

			console.log('Current players:', state.playerData);

			socket.on('join', (joinData) => {
				console.log('Player joined:', joinData);
				state.playerData.push({ name: joinData.name, socketId: socket.id, score: 0 });
				io.emit('playerData', state.playerData);
				// need to emit to all clients the new player data
				io.emit('whoControls', state.playerData[0]?.socketId || ''); // emit the first player as the controller
			});

			socket.on('disconnect', () => {
				console.log('A client disconnected:', socket.id);
				// Remove player from playerData
				const index = state.playerData.findIndex(player => player.socketId === socket.id);
				if (index !== -1) {
					state.playerData.splice(index, 1);
					console.log('Updated players:', state.playerData);
					io.emit('state.playerData', state.playerData); // Notify all clients about the updated player list
				}
			});

			socket.on('selectQuestion', (question) => {
				console.log('Question selected:', question);
				// Handle question selection logic here
				io.emit('selectQuestion', question); // Broadcast the selected question to all clients
			});

			socket.on('buzzed', (name: string) => {
				console.log('Buzz received from:', name);

				if (state.whoBuzzed !== null) {
					console.log('A player has already buzzed:', state.whoBuzzed);
				} else {
					state.whoBuzzed = name; // Set the player who buzzed
					io.emit('buzzed', state.whoBuzzed); // Broadcast the buzz event to all clients
				}
			});

			socket.on('checkAnswer', ({ answer, question, socketId }: CheckAnswerPayload) => {
				console.log('Received answer:', answer);
				// Handle the guess logic here
				// broadcast guess to all clients 
				state.whoBuzzed = null; // Reset who buzzed after checking the answer
				io.emit('checkAnswer', answer, socketId);
				// Update player score based on the answer
				const player = state.playerData.find(player => player.socketId === socketId);
				if (player) {
					if (answer.toLowerCase() === question.answer.toLowerCase()) {
						player.score += question.points;
						io.emit('whoControls', player.socketId); // the player who answered correctly becomes the controller
					} else {
						player.score -= question.points; // Deduct points for incorrect answer
					}
					console.log(`Updated score for ${player.name}: ${player.score}`);
					io.emit('playerData', state.playerData);
				}
			});
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	server: {
		fs: {
			allow: ['../static'],
		}
	}
});
