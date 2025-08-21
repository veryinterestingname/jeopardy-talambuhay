<script lang="ts">
	import { QuestionState, type Question } from '$lib';
	import type { Socket } from 'socket.io-client';
	// This component is used to display a question card when a question is selected.

	let buzzed = $state(false);
	// tries to set buzzed to true. otherwise sets buzzed to false.
	let setBuzzed = (value: boolean) => {
		value ? socket.emit('buzzed', name) : (setWhoBuzzed(''), (buzzed = false));
	};

	// let showAnswer = $state(false); // don't need this, can be derived from selectedQuestion.answered
	let whoBuzzed = $state('');
	let guess = $state('');
	let setWhoBuzzed = (name: string) => (whoBuzzed = name);
	let {
		selectedQuestion,
		socket,
		name,
		backToBoard
	}: {
		selectedQuestion: Question;
		socket: typeof Socket;
		name: string;
		backToBoard: () => void;
	} = $props();
	let userAnswer = $state('');
	let questionState = $derived(() =>
		selectedQuestion.answered
			? QuestionState.ShowAnswer
			: buzzed
				? QuestionState.Guessing
				: QuestionState.Open
	);

	// SOCKET LISTEN EVENTS
	socket.on('buzzed', (playerName: string) => {
		setWhoBuzzed(playerName);
		if (playerName) {
			console.log(`${playerName} buzzed in!`);
			buzzed = true;
		} else {
			console.log('reset buzzer');
			buzzed = false;
		}
	});
	socket.on('checkAnswer', (buzzGuess: string, socketId: string) => {
		console.log(`Guess: ${buzzGuess} by ${socketId}`);
		guess = buzzGuess;
		// sent by the server for other players to see the answer
		// TODO: we aren't supposed to move on to check answer, we should run out of time, then markAsAnswered.
	});
	socket.on('timeUp', () => {
		new Audio('https://www.myinstants.com/media/sounds/times-up.mp3').play();
	});
	import { scale } from 'svelte/transition';
	const isCorrect = $derived(selectedQuestion.answer.toLowerCase() === guess.toLowerCase().trim());
	function submitAnswer(answer: string) {
		socket.emit('checkAnswer', {
			answer: answer.trim(),
			question: selectedQuestion,
			socketId: socket.id
		});
	}

	$effect(() => {
		// side effects, use this rune sparingly! like playing sounds.
		if (isCorrect) {
			new Audio('https://www.myinstants.com/media/sounds/rightanswer.mp3').play();
		}
	});
</script>

<div class="modal" transition:scale={{ delay: 200 }}>
	<div class="modal-content">
		<div class="question">
			{selectedQuestion.question}
			{#if selectedQuestion.imgSrc}
				<img class="half-screen-img" src={selectedQuestion.imgSrc} alt="question" />
			{/if}
		</div>

		{#if questionState() === QuestionState.Open}
			<button class="buzz-button" onclick={() => setBuzzed(true)}> BUZZ IN! </button>
		{:else if questionState() === QuestionState.Guessing}
			{#if whoBuzzed !== name}
				<p>{whoBuzzed} buzzed in first! guessing...</p>
			{:else}
				<input bind:value={userAnswer} placeholder="Enter your answer" />
				<button
					onclick={() => {
						submitAnswer(userAnswer);
					}}>Submit</button
				>
			{/if}
		{:else if questionState() === QuestionState.ShowAnswer}
			<div class="answer">
				Correct Answer: {selectedQuestion.answer}
			</div>
		{/if}
		{#if guess !== '' && !isCorrect}
			<p>{guess} is Incorrect!</p>
		{/if}

		<button
			class="back-btn"
			disabled={questionState() !== QuestionState.ShowAnswer}
			onclick={backToBoard}
		>
			Back to Board
		</button>
	</div>
</div>

<style>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.9);
		display: grid;
		place-items: center;
		opacity: 0.9;
	}

	button {
		background: transparent;
		border: none;
		color: var(--point-color);
		cursor: pointer;
	}
	.modal-content {
		background: var(--theme-color);
		color: white;
		padding: 2rem;
		border-radius: 10px;
		max-width: 800px;
		text-align: center;
	}

	:global(.half-screen-img) {
		/*you need global because this css needs to be seen in the static html*/
		max-width: 100%; /* Prevents overflow on small screens, 100% of the modal-content */
		height: auto; /* Maintains aspect ratio */
		max-height: 80vh;
		display: block; /* Removes inline spacing */
		object-fit: contain; /* Ensures the whole image is visible */
	}

	.buzz-button {
		background: var(--point-color);
		color: #000;
		padding: 1rem 2rem;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 1.5rem;
		margin: 1rem;
	}
	.answer {
		padding: 1rem 2rem;
	}

	input {
		padding: 0.5rem;
		font-size: 1.2rem;
		margin: 1rem;
	}
	.back-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
