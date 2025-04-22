from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from TaskGenerator import get_task_json

app = FastAPI()

class TaskRequest(BaseModel):
    user_input: str
    project_id: Optional[int] = None

@app.post("/generate-tasks")
def generate_tasks(request: TaskRequest):
    try:
        tasks = get_task_json(request.user_input, request.project_id)
        return {"tasks": tasks}
    except Exception as e:
        return {"error": str(e)}
