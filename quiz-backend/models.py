from pydantic import BaseModel
from typing import List


class Question(BaseModel):
    id: int
    category: str
    question: str
    options: List[str]
    explanation: str


class QuestionInternal(Question):
    correct_index: int


class AnswerSubmission(BaseModel):
    question_id: int
    selected_index: int


class AnswerResponse(BaseModel):
    correct: bool
    explanation: str


class StartQuizRequest(BaseModel):
    category: str
    limit: int = 10


class StartQuizResponse(BaseModel):
    quiz_id: str
    questions: List[Question]


class SaveAnswerResponse(BaseModel):
    status: str


class ResultDetail(BaseModel):
    question: str
    correct: bool
    explanation: str


class QuizResultResponse(BaseModel):
    score: int
    total: int
    details: List[ResultDetail]
