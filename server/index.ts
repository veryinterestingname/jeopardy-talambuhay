import express from 'express'
import { createServer } from 'http'
import { handler } from '../build/handler.js'
import { Server } from 'socket.io'
import { addSocketHandlers } from './socketHandlers.ts'

const runServer = () => {
  const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000
  const app = express()
  const server = createServer(app)
  const io = new Server(server, {
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    }
  })
  // SvelteKit should handle everything else using Express middleware
  // https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
  addSocketHandlers(io)
  app.use(handler)

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}
if (process.env.NODE_ENV === 'production') runServer()