export interface Question {
    id: number;
    category: string;
    question: string;
    options: string[];
    explanation: string;
}

export interface QuizResponse {
    quiz_id: string;
    questions: Omit<Question, "correct_index">[];
}