from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from src.task_generator import get_task_json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class TaskRequest(BaseModel):
    user_input: str

@app.post("/extract-tasks")
async def extract_tasks(request: TaskRequest):
    logger.info(f"Received request with user_input: {request.user_input}")
    try:
        tasks = get_task_json(request.user_input)
        logger.info(f"Successfully generated tasks: {tasks}")
        return tasks
    except Exception as e:
        logger.error(f"Error generating tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating tasks: {str(e)}")