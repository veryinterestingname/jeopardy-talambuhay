import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { handler } from '../build/handler.js'
import { state, type CheckAnswerPayload } from './db.ts'

const addSocketHandlers = (io: Server) => {
  // Common WebSocket logic for both environments
  io.on('connect', (socket) => {

    console.log('A client connected:', socket.id);

    console.log('Current players:', state.playerData);

    socket.on('join', (joinData) => {
      console.log('Player joined:', joinData);
      if (state.whoControls === null) {
        state.whoControls = socket.id; // the first player who joins becomes the controller
      }
      state.playerData.push({ name: joinData.name, socketId: socket.id, score: 0 });
      // need to emit to all clients the new player data
      io.emit('playerData', state.playerData);
      // emit the current state only to the newly joined player
      socket.emit('whoControls', state.whoControls ?? (state.playerData[0]?.socketId || '')); // emit the first player as the controller
      socket.emit('questionData', state.categories);
    });

    socket.on('disconnect', () => {
      console.log('A client disconnected:', socket.id);
      // Remove player from playerData
      const index = state.playerData.findIndex(player => player.socketId === socket.id);
      if (index !== -1) {
        state.playerData.splice(index, 1);
        state.whoControls = state.playerData.length > 0 ? state.playerData[0].socketId : null; // Reset who controls if no players left

        console.log('Updated players:', state.playerData);
        io.emit('playerData', state.playerData); // Notify all clients about the updated player list
        io.emit('whoControls', state.whoControls); // Notify all clients about the updated controller
      }
    });

    socket.on('selectQuestion', (question) => {
      console.log('Question selected:', question);
      state.selectedQuestion = question; // Store the selected question in the state
      io.emit('selectQuestion', question); // Broadcast the selected question to all clients

      // start the timer for the question
      if (question) {
        state.timeLeft = 8;
        startTimer(io);
      }
    });

    socket.on('buzzed', (name: string) => {
      console.log('Buzz received from:', name);

      if (state.whoBuzzed !== null) {
        console.log('A player has already buzzed:', state.whoBuzzed);
      } else {

        clearInterval(state.intervalId!);
        state.intervalId = null;

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
        if (answer.toLowerCase().trim() === question.answer.toLowerCase()) {
          player.score += question.points;
          io.emit('whoControls', player.socketId); // the player who answered correctly becomes the controller

          // also emit question as answered
          markAsAnswered();
          io.emit('selectQuestion', state.selectedQuestion);
          io.emit('questionData', state.categories);
        }
        else {
          console.log(`Incorrect answer from ${player.name}, ${socketId}. Deducting points.`);
          player.score -= question.points; // Deduct points for incorrect answer
          // open up the question again for others to answer
          startTimer(io);
          if (state.timeLeft <= 2) {
            state.timeLeft += 1;
          }
          state.whoBuzzed = null;
          io.emit('buzzed', null);
        }
        console.log(`Updated score for ${player.name}: ${player.score}`);
        io.emit('playerData', state.playerData);
      }
    });
  });
}

const startTimer = (io: Server) => {
  state.intervalId = setInterval(() => {
    state.timeLeft -= 1;
    if (state.timeLeft <= 0) {
      clearInterval(state.intervalId!);
      state.intervalId = null;
      markAsAnswered();
      // mark the question as answered and time up
      io.emit('timeUp');
      io.emit('selectQuestion', state.selectedQuestion);
      io.emit('questionData', state.categories);
    }
  }, 1000);
}
const markAsAnswered = () => {
  if (state.selectedQuestion) {
    state.selectedQuestion = { ...state.selectedQuestion, answered: true };
  }
  // update the question in categories as well 
  state.categories = state.categories.map((category) => {
    return {
      ...category,
      questions: category.questions.map((q) =>
        q.question === state.selectedQuestion?.question ? state.selectedQuestion! : q
      )
    };
  });
}


const runServer = () => {
  const port = 3000
  const app = express()
  const server = createServer(app)
  const io = new Server(server)
  // SvelteKit should handle everything else using Express middleware
  // https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
  addSocketHandlers(io)
  app.use(handler)

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}
if (process.env.NODE_ENV === 'production') runServer()

export { addSocketHandlers }