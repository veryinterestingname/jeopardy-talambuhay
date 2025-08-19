
<script lang="ts">
	import type { Question } from '$lib';
	import { Socket } from 'socket.io-client';
    // This component is used to display a question card when a question is selected.
    
	let {selectedQuestion, name, buzzed, setBuzzed, whoBuzzed, submitAnswer, showAnswer, backToBoard, guess}: {
        selectedQuestion: Question;
        name: string;
        buzzed: boolean;
        setBuzzed: (value: boolean) => void;
        whoBuzzed: string;
        submitAnswer: (answer: string) => void;
        showAnswer: boolean;
        backToBoard: () => void;
        guess: string;
    } = $props(); 
    let userAnswer = $state('');
	import { scale } from 'svelte/transition';
</script>

<div class="modal" transition:scale={{ delay: 200 }}>
	<div class="modal-content">
		<div class="question">
			{selectedQuestion.question}
			{#if selectedQuestion.imgSrc}
				<img class="half-screen-img" src={selectedQuestion.imgSrc} alt="question" />
			{/if}
		</div>
        <!-- todo: be able to talk to the socket (emits) -->
		{#if !buzzed}
			<button class="buzz-button" onclick={() => (setBuzzed(true))}> BUZZ IN! </button>
        {:else if whoBuzzed !== name}
            <p>{whoBuzzed} is guessing...</p>
		{:else if whoBuzzed === name}
			<input bind:value={userAnswer} placeholder="Enter your answer" />
			<button onclick={() => submitAnswer(userAnswer)}>Submit</button>
		{/if}

		{#if showAnswer}
			<div class="answer">
				Correct Answer: {selectedQuestion.answer}<br />
				{selectedQuestion.answer.toLowerCase() === guess.toLowerCase().trim()
					? 'Correct!'
					: 'Incorrect!'}
			</div>
		{/if}
		<button class="back-btn" disabled={!selectedQuestion.answered} onclick={backToBoard}> Back to Board </button>
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
        opacity: .9;
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

	input {
		padding: 0.5rem;
		font-size: 1.2rem;
		margin: 1rem;
	}
</style>