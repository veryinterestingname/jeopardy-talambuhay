import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { handler } from '../build/handler.js'
import { state } from './players.ts'

const port = 3000
const app = express()
const server = createServer(app)
const io = new Server(server)
io.on('connection', (socket) => {
  socket.emit('eventFromServer', 'Hello, World 👋')
  state.playerData.push({ name: socket.id, score: 0 })
  console.log('A client connected:', socket.id)
  socket.emit('join', socket.id)
})

// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
app.use(handler)

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
const whoBuzzed: string | null = null;
export default whoBuzzed;