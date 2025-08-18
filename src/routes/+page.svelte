<script lang="ts">
	import type { Question } from '$lib/index';
	import { scale } from 'svelte/transition';
	import io from 'socket.io-client'

	const socket = io()

	socket.on('eventFromServer', (message: string) => {
		console.log(message)
	})


	// make selectedQuestion a type of optional question
	let selectedQuestion: Question | null | undefined = $state(null);

	let {
		data
	}: {
		data: { pastQuestions: Question[]; presentQuestions: Question[]; futureQuestions: Question[] };
	} = $props();
	let buzzed = $state(false);
	let userAnswer = $state('');
	let showAnswer = $state(false);
	const sortQuestions = (questions: Question[]) => {
		return questions.sort((a, b) => a.points - b.points);
	};
	const pastQuestions = sortQuestions(data.pastQuestions);
	const presentQuestions = sortQuestions(data.presentQuestions);
	const futureQuestions = sortQuestions(data.futureQuestions);
	let categories = $state([
		{
			title: 'My Past',
			questions: pastQuestions
		},
		{
			title: 'My Present',
			questions: presentQuestions
		},
		{
			title: 'My Future',
			questions: futureQuestions
		}
	]);

	// When someone selects a question.
	function handleSelect(question: Question) {
		if (question.answered) return; // Prevent selecting an already answered question
		selectedQuestion = question;
		buzzed = false;
		userAnswer = '';
		showAnswer = false;
	}

	function checkAnswer() {
		showAnswer = true;
		if (selectedQuestion) {
			selectedQuestion.answered = true;
		}
		console.log(categories);
	}
	function backToBoard() {
		selectedQuestion = null;
		buzzed = false;
		userAnswer = '';
		showAnswer = false;
	}
</script>

<div class="board">
	{#each categories as category}
		<div>
			<h2 class="category">{category.title.toUpperCase()}</h2>
			{#each category.questions as question}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="question-card {question.answered ? 'answered' : ''}"
					onclick={() => handleSelect(question)}
				>
					{#if !question.answered}
						${question.points}
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

{#if selectedQuestion}
	<div class="modal" transition:scale>
		<div class="modal-content">
			<div class="question">
				{selectedQuestion.question}
				{#if selectedQuestion.imgSrc}
					<img class="half-screen-img" src={selectedQuestion.imgSrc} alt="question" />
				{/if}
			</div>

			{#if !buzzed}
				<button class="buzz-button" onclick={() => (buzzed = true)}> BUZZ IN! </button>
			{:else}
				<input bind:value={userAnswer} placeholder="Enter your answer" />
				<button onclick={checkAnswer}>Submit</button>
			{/if}

			{#if showAnswer}
				<div class="answer">
					Correct Answer: {selectedQuestion.answer}<br />
					{selectedQuestion.answer.toLowerCase() === userAnswer.toLowerCase().trim()
						? 'Correct!'
						: 'Incorrect!'}
				</div>
			{/if}
			<button class="back-btn" onclick={backToBoard}> Back to Board </button>
		</div>
	</div>
{/if}

<style>
	@import url('https://fonts.cdnfonts.com/css/itc-korinna-std');

	:root {
		--theme-color: #060ce9;
		--point-color: goldenrod;
		font-family: 'ITC_ Korinna', sans-serif;
	}
	.board {
		display: grid;
		background-color: black;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		padding: 2rem;
	}

	.category {
		background: var(--theme-color);
		color: white;
		padding: 1rem;
		text-align: center;
		justify-self: center;
		vertical-align: middle;
		min-height: 3rem;
	}

	.question-card {
		background: var(--theme-color);
		color: var(--point-color);
		padding: 1rem;
		font-size: 2rem;
		margin: 0.5rem 0;
		cursor: pointer;
		text-align: center;
		transition: transform 0.3s ease;
		min-height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
	}
	.question-card.answered {
		background: var(--theme-color);
		color: #888;
		cursor: default;
	}

	.question-card:hover:not(.answered) {
		transform: scale(1.05);
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.9);
		display: grid;
		place-items: center;
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
