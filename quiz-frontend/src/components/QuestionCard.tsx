import React from "react";
import type { Question } from "../api";

interface Props {
    question: Question;
    selected?: number;
    onSelect: (index: number) => void;
}

const LABELS = ["A", "B", "C", "D"];

export const QuestionCard: React.FC<Props> = ({ question, selected, onSelect }) => {
    return (
        <div className="fade-up fade-up-2">

            {/* Question text */}
            <h2
                className="font-serif text-text font-normal leading-snug mb-10"
                style={{ fontSize: "clamp(1.2rem, 3vw, 1.65rem)" }}
            >
                {question.question}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-px bg-border">
                {question.options.map((opt, i) => {
                    const isSelected = selected === i;
                    return (
                        <button
                            key={i}
                            onClick={() => onSelect(i)}
                            className={`
                flex items-start gap-4 px-5 py-4 text-left border-0 cursor-pointer font-mono
                transition-colors duration-150
                ${isSelected
                                    ? "bg-accent/10 border-l-2 border-l-accent"
                                    : "bg-surface hover:bg-raised"
                                }
              `}
                        >
                            <span className={`shrink-0 text-[10px] tracking-[0.1em] mt-0.5 min-w-[16px] transition-colors ${isSelected ? "text-accent" : "text-muted"}`}>
                                {LABELS[i]}
                            </span>
                            <span className="text-[14px] text-text leading-relaxed">
                                {opt}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
