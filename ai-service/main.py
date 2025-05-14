from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from src.task_generator import get_task_json, calculate_match_percentage
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Định nghĩa model cho endpoint hiện tại
class TaskRequest(BaseModel):
    user_input: str

# Định nghĩa model cho user
class User(BaseModel):
    _id: str
    id: int
    name: str
    role: str
    avatar: str
    created_at: str
    tasksInCurrentProject: int
    totalTasksAcrossProjects: int

# Định nghĩa model cho task trong body mới
class Task(BaseModel):
    title: str
    description: str
    role: str
    assignableUsers: List[User]

# Định nghĩa model cho endpoint process-tasks
class TaskProcessRequest(BaseModel):
    user_input: str
    users: List[User]

# Định nghĩa model cho endpoint process-tasks-with-data
class TaskDataRequest(BaseModel):
    tasks: List[Task]

# Endpoint hiện tại: Trích xuất task từ user_input
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

# Endpoint process-tasks: Trích xuất task và gán user từ input
@app.post("/process-tasks")
async def process_tasks(request: TaskProcessRequest):
    logger.info(f"Received request with user_input: {request.user_input} and users: {request.users}")
    try:
        tasks = get_task_json(request.user_input, users=request.users)
        logger.info(f"Successfully processed tasks: {tasks}")
        return tasks
    except Exception as e:
        logger.error(f"Error processing tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing tasks: {str(e)}")

# Endpoint mới: Xử lý danh sách task đã định nghĩa và tính match_percentage
@app.post("/process-tasks-with-data")
async def process_tasks_with_data(request: TaskDataRequest):
    logger.info(f"Received request with tasks: {request.tasks}")
    try:
        # Xử lý từng task và tính match_percentage cho assignableUsers
        processed_tasks = []
        for task in request.tasks:
            task_dict = task.dict()
            # Tính match_percentage cho mỗi user trong assignableUsers
            updated_assignable_users = []
            for user in task.assignableUsers:
                user_dict = user.dict()
                # Giả định thêm tasksInCurrentProject và totalTasksAcrossProjects nếu không có
                user_dict["tasksInCurrentProject"] = user_dict.get("tasksInCurrentProject", 0)
                user_dict["totalTasksAcrossProjects"] = user_dict.get("totalTasksAcrossProjects", 0)
                user_dict["match_percentage"] = calculate_match_percentage(
                    task_dict, user
                )
                updated_assignable_users.append(user_dict)
            # Sắp xếp user theo match_percentage (giảm dần)
            updated_assignable_users.sort(key=lambda x: x["match_percentage"], reverse=True)
            task_dict["assignableUsers"] = updated_assignable_users
            processed_tasks.append(task_dict)

        logger.info(f"Successfully processed tasks with data: {processed_tasks}")
        return processed_tasks
    except Exception as e:
        logger.error(f"Error processing tasks with data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing tasks with data: {str(e)}")