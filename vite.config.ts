import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
// server code for websockets here
import { Server } from 'socket.io'; // https://www.youtube.com/watch?v=mAcKzdW5fR8 
import { addSocketHandlers } from './server/index.ts';

const webSocketServer = {
	name: "webSocketServer",
	configureServer(server: ViteDevServer) { // this is from vite plugin system 
		if (!server.httpServer) return; // ensure server is running
		const io = new Server(server.httpServer, {
			connectionStateRecovery: {
				maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
			}
		});
		addSocketHandlers(io);
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
