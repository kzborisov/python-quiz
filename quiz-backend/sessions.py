import uuid
from typing import Dict
from models import QuestionInternal


class QuizSession:
    def __init__(self, questions: list[QuestionInternal]) -> None:
        self.questions: list[QuestionInternal] = questions
        self.answers: dict[int, int] = {}


QUIZ_SESSIONS: Dict[str, QuizSession] = {}


def create_session(questions: list[QuestionInternal]) -> str:
    quiz_id: str = str(uuid.uuid4())
    QUIZ_SESSIONS[quiz_id] = QuizSession(questions)
    return quiz_id


def save_answer(
    quiz_id: str,
    question_id: int,
    selected_index: int,
) -> bool:
    session: QuizSession | None = QUIZ_SESSIONS.get(quiz_id)
    if session is None:
        return False

    session.answers[question_id] = selected_index
    return True


def get_session(quiz_id: str) -> QuizSession | None:
    return QUIZ_SESSIONS.get(quiz_id)
