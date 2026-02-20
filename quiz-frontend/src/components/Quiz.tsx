import React, { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { Result } from "./Result";
import { startQuiz, submitAnswer, getResult } from "../api";
import type { Question } from "../types";

interface Props {
    category: string;
    onBack?: () => void;
}

export const Quiz: React.FC<Props> = ({ category, onBack }) => {
    const [quizId, setQuizId] = useState<string>("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [finished, setFinished] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const loadQuiz = async () => {
        setLoading(true);
        const data = await startQuiz(category);
        setQuizId(data.quiz_id);
        setQuestions(data.questions as Question[]);
        setCurrent(0);
        setAnswers({});
        setFinished(false);
        setLoading(false);
    };

    const handleSelect = (index: number) => {
        if (!questions[current]) return;
        setAnswers(prev => ({ ...prev, [questions[current].id]: index }));
    };

    const submitCurrentAnswer = async () => {
        const q = questions[current];
        if (!q) return;
        const sel = answers[q.id];
        if (sel !== undefined) await submitAnswer(quizId, q.id, sel);
    };

    const handleNext = async () => {
        await submitCurrentAnswer();
        if (current < questions.length - 1) setCurrent(p => p + 1);
    };

    const handlePrev = () => { if (current > 0) setCurrent(p => p - 1); };

    const handleFinish = async () => {
        await submitCurrentAnswer();
        const res = await getResult(quizId);
        setResult(res);
        setFinished(true);
    };

    // ── Start screen ──────────────────────────────────────────────
    if (!quizId) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
                <div className="fade-up text-center max-w-sm">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="text-muted text-[12px] tracking-[0.1em] bg-transparent border-0 cursor-pointer mb-10 flex items-center gap-1 mx-auto hover:text-text transition-colors"
                        >
                            ← Back
                        </button>
                    )}
                    <p className="text-muted text-[11px] uppercase tracking-[0.2em] mb-3">Category</p>
                    <h2
                        className="font-serif text-text font-normal capitalize mb-8"
                        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
                    >
                        {category.replaceAll("_", " ")}
                    </h2>
                    <p className="text-muted text-[13px] leading-relaxed mb-12">
                        10 questions. No time limit.<br />Think carefully before you answer.
                    </p>
                    <button
                        onClick={loadQuiz}
                        disabled={loading}
                        className="bg-accent text-background text-[13px] uppercase tracking-[0.12em] px-10 py-3 border-0 cursor-pointer disabled:opacity-50 hover:opacity-90 transition-opacity font-mono"
                    >
                        {loading ? "Loading..." : "Begin Quiz"}
                    </button>
                </div>
            </div>
        );
    }

    if (finished && result) return <Result {...result} onBack={onBack} />;

    const progress = ((current + 1) / questions.length) * 100;

    // ── Quiz screen ───────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-2xl">

                {/* Top bar */}
                <div className="fade-up flex items-center justify-between mb-10">
                    <span className="text-[11px] text-muted uppercase tracking-[0.15em] capitalize">
                        {category.replaceAll("_", " ")}
                    </span>
                    <span className="text-[11px] text-muted tabular-nums">
                        {String(current + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
                    </span>
                </div>

                {/* Progress — single 1px line */}
                <div className="fade-up fade-up-1 mb-10 h-px bg-border relative">
                    <div
                        className="absolute left-0 top-0 h-px bg-accent transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Question card */}
                {questions[current] && (
                    <QuestionCard
                        question={questions[current]}
                        selected={answers[questions[current].id]}
                        onSelect={handleSelect}
                    />
                )}

                {/* Navigation */}
                <div className="fade-up fade-up-3 flex items-center justify-between mt-10">
                    <button
                        onClick={handlePrev}
                        disabled={current === 0}
                        className="bg-transparent border-0 text-[12px] tracking-[0.1em] cursor-pointer font-mono transition-colors disabled:text-border disabled:cursor-default text-muted hover:text-text"
                    >
                        ← Prev
                    </button>

                    <button
                        onClick={handleFinish}
                        className="border border-border bg-transparent text-accent text-[11px] uppercase tracking-[0.15em] px-6 py-2 cursor-pointer font-mono hover:border-accent hover:bg-accent/10 transition-colors"
                    >
                        Finish
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={current === questions.length - 1}
                        className="bg-transparent border-0 text-[12px] tracking-[0.1em] cursor-pointer font-mono transition-colors disabled:text-border disabled:cursor-default text-muted hover:text-text"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};
