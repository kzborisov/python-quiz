import React from "react";

interface Props {
    score: number;
    total: number;
    details: {
        question: string;
        correct: boolean;
        explanation: string;
    }[];
    onBack?: () => void;
}

export const Result: React.FC<Props> = ({ score, total, details, onBack }) => {
    const pct = Math.round((score / total) * 100);
    const correct = details.filter(d => d.correct).length;
    const incorrect = details.filter(d => !d.correct).length;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-16 px-4">
            <div className="w-full max-w-2xl">

                {/* Score hero */}
                <div className="fade-up text-center mb-16">
                    <p className="text-muted text-[11px] uppercase tracking-[0.2em] mb-3">Result</p>
                    <div className="font-serif text-accent font-normal leading-none" style={{ fontSize: "clamp(4rem, 12vw, 7rem)" }}>
                        {pct}<span className="text-[0.4em] align-middle">%</span>
                    </div>
                    <p className="text-muted text-[13px] mt-3">{score} correct out of {total}</p>

                    {/* Correct / Incorrect counts */}
                    <div className="flex items-center justify-center gap-8 mt-6">
                        <div>
                            <span className="block text-xl text-correct">{correct}</span>
                            <span className="block text-[10px] uppercase tracking-[0.1em] text-muted mt-1">Correct</span>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div>
                            <span className="block text-xl text-wrong">{incorrect}</span>
                            <span className="block text-[10px] uppercase tracking-[0.1em] text-muted mt-1">Incorrect</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="fade-up fade-up-1 h-px bg-border mb-8" />

                {/* Details */}
                <div className="flex flex-col gap-px bg-border">
                    {details.map((d, i) => (
                        <div
                            key={i}
                            className={`fade-up bg-surface px-6 py-5 border-l-2 ${d.correct ? "border-l-correct" : "border-l-wrong"}`}
                            style={{ animationDelay: `${0.08 + i * 0.04}s` }}
                        >
                            <div className="flex justify-between items-start gap-3 mb-2">
                                <p className="text-[14px] text-text leading-relaxed flex-1">{d.question}</p>
                                <span className={`shrink-0 text-[11px] tracking-widest ${d.correct ? "text-correct" : "text-wrong"}`}>
                                    {d.correct ? "✓" : "✗"}
                                </span>
                            </div>
                            <p className="text-[12px] text-muted leading-relaxed">{d.explanation}</p>
                        </div>
                    ))}
                </div>

                {/* Back button */}
                {onBack && (
                    <div className="fade-up fade-up-4 text-center mt-12">
                        <button
                            onClick={onBack}
                            className="border border-border bg-transparent text-muted text-[11px] uppercase tracking-[0.15em] px-8 py-3 cursor-pointer font-mono hover:border-accent hover:text-accent transition-colors"
                        >
                            ← Choose Category
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
