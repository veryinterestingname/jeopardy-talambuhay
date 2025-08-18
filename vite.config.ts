import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';

// server code for websockets here
import { Server } from 'socket.io'; // https://www.youtube.com/watch?v=mAcKzdW5fR8 

const webSocketServer = { 
	name: "webSocketServer", 
	configureServer(server: ViteDevServer) { // this is from vite plugin system 
		if (!server.httpServer) return; // ensure server is running
		const io = new Server(server.httpServer);
		io.on('connect', (socket) => {
			
			console.log('A client connected:', socket.id);
			socket.emit('message', 'Welcome to the WebSocket server!');
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
