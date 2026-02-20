# python-quiz


## Start the backend
```bash
cd quiz-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Start the frontend
```bash
cd quiz-frontend
npm install
npm run dev
```
