import type { Question } from '$lib/index';

const pastQuestions: Question[] = [
    {
        points: 100,
        question: 'What US state is the Land of Lincoln?',
        answer: 'Illinois',
        answered: false
    },
    {
        points: 200,
        question:
            'Which country\'s flag is this? <img class="half-screen-img" src="https://cdn.britannica.com/34/4034-050-91EE1BCF/Flag-Myanmar.jpg" alt="Flag">',
        answer: 'Myanmar',
        answered: false
    },
    {
        points: 300,
        question:
            'What Ivy League school has the highest Native American enrollment (a whoppping 1%)?',
        answer: 'Dartmouth',
        answered: false
    },
    {
        points: 400,
        question: 'Who wrote the Critique of Pure Reason?',
        answer: 'Immanuel Kant',
        answered: false
    }
];

const presentQuestions: Question[] =
    [
        {
            points: 200,
            question:
                'What kind of rock is this? \n \
            <img class="half-screen-img" src="https://madera.objects.liquidweb.services/photos/16842-half-dome-closeup-from-glacier-point-steve-montalto-hmi-Rectangle-600x400.jpg" alt="Rock">',
            answer: 'Granite',
            answered: false
        },
        {
            points: 100,
            question:
                'What is this Cafe called? \n \
                <img class="half-screen-img" src="https://lh3.googleusercontent.com/p/AF1QipNsmB0ugJeJxYVrBKpRkNkyiEa6cKLamFZ4r0M=s1360-w1360-h1020" alt="Cafe">',
            answer: 'Chaotic Good',
            answered: false
        },
        {
            points: 300,
            question: 'What programming language is the below code? \n \
                <img class="half-screen-img" src="/programming_language.png" alt="Code">',
            answer: 'Javascript',
            answered: false
        },
        {
            points: 400,
            question:
                'Who painted this? \n \
            <img class="half-screen-img" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjb1tCOwOdOeYcp5iflCvvW95qCqpmNUo-TMIt3ndxzsxzmgmH18iClIIQLPO48ojPg5Rts2AUm9rZBeVPcjnjrjGaLSzCwbipQotY4EhOk3tUoHJjJyZjTqfY5s9MZ5eSkGrrqmom4JXUdHEqE-Ts8E9i-SuFf9xEukJcFBs5NuOhe6ANdODMFYzyV_Q/s16000/Unfinished.jpg">',
            answer: 'Keith Haring',
            answered: false
        }
    ];
const futureQuestions: Question[] = [];
export function load() {
    return {
        pastQuestions,
        presentQuestions,
        futureQuestions
    }
}