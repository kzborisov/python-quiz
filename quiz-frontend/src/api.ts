import axios from "axios";
import type { Question, QuizResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getCategories = async (): Promise<string[]> => {
    return [
        "python_basics",
        "python_internals",
        "python_advanced",
        "algorithms_and_data_structures",
    ];
};

export const startQuiz = async (category: string, limit = 50): Promise<QuizResponse> => {
    const res = await axios.post<QuizResponse>(`${API_URL}/quiz/start`, { category, limit });
    return res.data;
};

export const submitAnswer = async (quiz_id: string, question_id: number, selected_index: number) => {
    await axios.post(`${API_URL}/quiz/${quiz_id}/answer`, { question_id, selected_index });
};

export const getResult = async (quiz_id: string) => {
    const res = await axios.get(`${API_URL}/quiz/${quiz_id}/result`);
    return res.data;
};