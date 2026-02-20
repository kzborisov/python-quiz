import React, { useState, useEffect } from "react";
import { Quiz } from "./components/Quiz";
import { getCategories } from "./api";

const App: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  if (selected) return <Quiz category={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="grain min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">

      {/* Header */}
      <div className="fade-up text-center mb-16">
        <p className="text-muted text-[11px] uppercase tracking-[0.2em] mb-4">
          Senior Level
        </p>
        <h1 className="font-serif text-text font-normal leading-[1.1]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
          Python Quiz
        </h1>
        <div className="w-10 h-px bg-accent mx-auto my-6" />
        <p className="text-muted text-[13px] leading-relaxed max-w-sm mx-auto">
          Challenge your expertise across core Python domains. Each category tests depth, not breadth.
        </p>
      </div>

      {/* Category grid — 1px gap on bg-border creates the grid lines */}
      <div
        className="fade-up fade-up-2 w-full bg-border"
        style={{ maxWidth: "800px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1px" }}
      >
        {categories.map((c, i) => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            className="fade-up bg-surface hover:bg-raised text-left p-8 border-0 cursor-pointer transition-colors duration-200 group"
            style={{ animationDelay: `${0.1 + i * 0.04}s` }}
          >
            <span className="block text-[10px] tracking-[0.15em] text-muted uppercase mb-2">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="block text-[15px] text-text capitalize leading-snug">
              {c.replaceAll("_", " ")}
            </span>
            <span className="block mt-3 text-accent text-lg transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        ))}
      </div>

      <p className="fade-up fade-up-4 text-muted mt-12 text-[11px] tracking-[0.1em]">
        Built for your team's growth
      </p>
    </div>
  );
};

export default App;
