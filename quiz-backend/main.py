from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from typing import List
import random

from models import (
    Question,
    QuestionInternal,
    AnswerSubmission,
    StartQuizRequest,
    StartQuizResponse,
    SaveAnswerResponse,
    QuizResultResponse,
    ResultDetail,
)
import service
import sessions

app: FastAPI = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"] for Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/quiz/start", response_model=StartQuizResponse)
def start_quiz(payload: StartQuizRequest) -> StartQuizResponse:
    questions: List[QuestionInternal] = service.get_questions(payload.category)

    if not questions:
        raise HTTPException(status_code=404, detail="No questions found")

    selected: List[QuestionInternal] = random.sample(
        questions,
        min(payload.limit, len(questions)),
    )

    quiz_id: str = sessions.create_session(selected)

    sanitized: List[Question] = [
        Question(
            id=q.id,
            category=q.category,
            question=q.question,
            options=q.options,
            explanation=q.explanation,
        )
        for q in selected
    ]

    return StartQuizResponse(
        quiz_id=quiz_id,
        questions=sanitized,
    )


@app.post(
    "/quiz/{quiz_id}/answer",
    response_model=SaveAnswerResponse,
)
def answer(
    quiz_id: str,
    payload: AnswerSubmission,
) -> SaveAnswerResponse:
    ok: bool = sessions.save_answer(
        quiz_id=quiz_id,
        question_id=payload.question_id,
        selected_index=payload.selected_index,
    )

    if not ok:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return SaveAnswerResponse(status="saved")


@app.get(
    "/quiz/{quiz_id}/result",
    response_model=QuizResultResponse,
)
def result(quiz_id: str) -> QuizResultResponse:
    session: sessions.QuizSession | None = sessions.get_session(quiz_id)

    if session is None:
        raise HTTPException(status_code=404, detail="Quiz not found")

    score: int = 0
    details: List[ResultDetail] = []

    for q in session.questions:
        selected: int | None = session.answers.get(q.id)

        correct: bool = q.correct_index == selected
        if correct:
            score += 1

        details.append(
            ResultDetail(
                question=q.question,
                correct=correct,
                explanation=q.explanation,
            )
        )

    return QuizResultResponse(
        score=score,
        total=len(session.questions),
        details=details,
    )
