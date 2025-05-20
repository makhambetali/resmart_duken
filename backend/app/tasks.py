# your_app/tasks.py
from celery_app import app

@app.task
def print_message():
    print("Сообщение: Celery работает! (Каждую минуту)")