import type { PlayerData, Question } from '$lib/index';

const playerData: PlayerData[] = [];
const TIME_LEFT = 8; // seconds
const sortQuestions = (questions: { points: number; question: string; answer: string; imgSrc?: string; }[]) => questions.sort((a, b) => a.points - b.points).map(q => ({ ...q, answered: false, buzzers: [] as string[] }));
const pastQuestions: Question[] = sortQuestions([
    {
        points: 100,
        question: 'What US state was the third to join the union?',
        answer: 'New Jersey',
    },
    {
        points: 200,
        question:
            'Which country\'s flag is this?',
        imgSrc: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
        answer: 'United States',
    },
    {
        points: 300,
        question:
            'What Ivy League school was founded two days before the civil war?',
        answer: 'MIT',
    },
    {
        points: 400,
        question: 'Who wrote War and Peace?',
        answer: 'Leo Tolstoy',
    }
]);

const presentQuestions: Question[] =
    sortQuestions([
        {
            points: 200,
            question:
                'What kind of rock is this?',
            imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/NY-Central-Park-Rock-7333.jpg/2560px-NY-Central-Park-Rock-7333.jpg',
            answer: 'Manhattan Schist',
        },
        {
            points: 100,
            question:
                'What is this Cafe called?',
            imgSrc: 'https://lh3.googleusercontent.com/p/AF1QipNsmB0ugJeJxYVrBKpRkNkyiEa6cKLamFZ4r0M=s1360-w1360-h1020',
            answer: 'Chaotic Good',
        },
        {
            points: 300,
            question: 'What file type is the below code?',
            imgSrc: '/codingLanguagePic.png',
            answer: 'Typescript',
        },
        {
            points: 400,
            question:
                'Who painted this?',
            imgSrc:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/960px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
            answer: 'Leonardo Da Vinci',
        }
    ]);
const futureQuestions: Question[] = sortQuestions([
    {
        points: 100,
        question:
            'This country is home to the Rockies, which are a mountain range',
        answer: 'United States',
    }
    {
        points: 200,
        question:
            'What is this Park called?',
        imgSrc: 'https://lik.com/cdn/shop/products/Peter-Lik-Central-Park-Spirit-Framed-Recess-Moun_1800x.jpg?v=1670363959',
        answer: 'Central Park',
    },
    {
        points: 300,
        question: 'What file type is the below code?',
        imgSrc: '/codingLanguagePic.png',
        answer: 'Typescript',
    },
    {
        points: 400,
        question:
            'Who painted this?',
        imgSrc:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/960px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
        answer: 'Leonardo Da Vinci',
    }
]);


const categories = [
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
];

export const state = {
    playerData,
    categories,
    selectedQuestion: null as Question | null | undefined,
    whoControls: null as string | null,
    timeLeft: TIME_LEFT,
    intervalId: null as NodeJS.Timeout | null,
    whoBuzzed: null as string | null,
};

export interface CheckAnswerPayload {
    answer: string;
    question: Question;
    socketId: string;
}