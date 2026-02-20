import json
from pathlib import Path
from typing import List

from models import QuestionInternal

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "questions"


def load_questions(category: str) -> List[QuestionInternal]:
    """
    Loads questions from a single category file.
    Example: questions/algorithms.json
    """
    file_path: Path = DATA_DIR / f"{category}.json"

    if not file_path.exists():
        return []

    with file_path.open("r", encoding="utf-8") as f:
        raw: List[dict] = json.load(f)

    return [QuestionInternal(**q) for q in raw]


def load_all_questions() -> List[QuestionInternal]:
    """
    Loads questions from all category files inside /questions.
    """
    questions: List[QuestionInternal] = []

    if not DATA_DIR.exists():
        return questions

    for file_path in DATA_DIR.glob("*.json"):
        with file_path.open("r", encoding="utf-8") as f:
            raw: List[dict] = json.load(f)
            questions.extend(QuestionInternal(**q) for q in raw)

    return questions


def get_questions(category: str | None = None) -> List[QuestionInternal]:
    """
    Public entry point.
    - If category is provided → load only that category.
    - If None → load everything.
    """
    if category:
        return load_questions(category)

    return load_all_questions()
