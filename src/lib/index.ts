// place files you want to import through the `$lib` alias in this folder.
export type Question = {
    points: number;
    question: string;
    answer: string;    
    answered: boolean;
    imgSrc?: string;
};