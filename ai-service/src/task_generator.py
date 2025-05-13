import os
import json
import logging
from openai import OpenAI
from dotenv import load_dotenv
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    timeout=60
)

def strip_markdown_fences(content: str) -> str:
    content = content.strip()
    if content.startswith("```json"):
        content = content.removeprefix("```json").removesuffix("```").strip()
    elif content.startswith("```"):
        content = content.removeprefix("```").removesuffix("```").strip()
    return content

def calculate_match_percentage(task: dict, user) -> float:
    """
    Tính toán mức độ phù hợp (match_percentage) của user với task.
    :param task: Dict chứa thông tin task (title, description, role)
    :param user: Đối tượng User chứa thông tin (role, tasksInCurrentProject, totalTasksAcrossProjects)
    :return: Phần trăm phù hợp (0-100)
    """
    role_score = 0  # 40%
    experience_score = 0  # 30%
    workload_score = 0  # 20%
    semantic_score = 0  # 10%

    # Role Matching (40%)
    task_role = task.get("role", "").lower()
    user_role = user.role.lower()
    if task_role == user_role:
        role_score = 40

    # Experience (30%)
    total_tasks = user.totalTasksAcrossProjects
    experience_score = min(30, total_tasks * 1.2)

    # Workload (20%)
    tasks_in_project = user.tasksInCurrentProject
    workload_score = max(0, 20 - tasks_in_project * 4)

    # Semantic Matching (10%)
    task_description = task.get("description", "").lower()
    semantic_keywords = []
    if "design" in task_description or "ui" in task_description:
        semantic_keywords.extend(["design", "ui"])
    elif "frontend" in task_description or "html" in task_description:
        semantic_keywords.extend(["frontend", "html"])
    elif "backend" in task_description or "authentication" in task_description:
        semantic_keywords.extend(["backend", "authentication"])
    elif "security" in task_description or "credentials" in task_description:
        semantic_keywords.extend(["security", "credentials"])
    elif "test" in task_description or "functionality" in task_description:
        semantic_keywords.extend(["test", "functionality"])
    elif "feedback" in task_description or "usability" in task_description:
        semantic_keywords.extend(["feedback", "usability"])
    elif "timeline" in task_description or "delivery" in task_description:
        semantic_keywords.extend(["timeline", "delivery"])
    if semantic_keywords and any(keyword in task_description for keyword in semantic_keywords):
        semantic_score = 10

    match_percentage = role_score + experience_score + workload_score + semantic_score
    return round(match_percentage, 2)

def get_task_json(user_input: str, users: list = None) -> list:
    system_prompt = """
        You are an AI assistant for project management specializing in task extraction. Your job is to analyze the user's input (a meeting note) and break it down into specific, actionable tasks. Return the tasks strictly in JSON format as an array of objects, with no additional comments, explanations, or formatting outside the JSON.

        Each task should represent a clear, actionable step derived from the input. Do not simply repeat the input as a task; instead, interpret the intent and break it down into smaller, practical tasks. Aim to generate at least 5-7 tasks to cover various aspects of the input, unless the input is too simple to warrant more.

        The output format must be: [{"title": "string", "description": "string", "role": "string"}]

        - "title": A concise name for the task (e.g., "Design login page UI").
        - "description": A detailed description of the task (e.g., "Create a wireframe or mockup for the login page UI").
        - "role": The role of the person who should perform this task. Choose only from the following predefined roles: "Designer", "Frontend Developer", "Backend Developer", "Tester", "Security Engineer", "Researcher", "Project Manager". Assign the role based on the nature of the task.

        Guidelines for task extraction:
        1. Analyze the input to identify goals, actions, or responsibilities.
        2. Break down complex sentences into smaller, actionable tasks (e.g., "Prepare and deliver a presentation" becomes "Draft presentation slides", "Create visuals for slides", "Practice presentation", and "Schedule delivery meeting").
        3. If the input mentions a deadline, include it in the task description.
        4. If the input involves multiple people or roles, create separate tasks for each person/role if applicable.
        5. If the input is vague, infer reasonable tasks based on the context (e.g., for "make a login page", include tasks for design, frontend, backend, testing, and security).
        6. Ensure each task is specific, actionable, and unique (e.g., avoid generic tasks like "Work on project" without a clear action).
        7. Assign an appropriate role from the predefined list based on the task's requirements:
        - "Designer" for UI/UX design tasks.
        - "Frontend Developer" for frontend development tasks (e.g., HTML, CSS, JavaScript).
        - "Backend Developer" for backend development tasks (e.g., server-side logic, authentication).
        - "Tester" for testing tasks.
        - "Security Engineer" for security-related tasks.
        - "Researcher" for research or analysis tasks.
        - "Project Manager" for management or planning tasks.
        8. Do not include any project ID or project-specific identifiers in the task title or description.
    """

    user_prompt = f"Here is the user input:\n{user_input}"

    max_retries = 3
    retry_delay = 1

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt.strip()},
                    {"role": "user", "content": user_prompt.strip()}
                ],
                temperature=0
            )

            raw_output = response.choices[0].message.content
            logger.info(f"Raw output from OpenAI: {raw_output}")

            clean_output = strip_markdown_fences(raw_output)
            logger.debug(f"Cleaned output: {clean_output}")

            tasks = json.loads(clean_output)

            if not isinstance(tasks, list):
                raise ValueError("OpenAI response must be a JSON array")

            required_fields = {"title", "description", "role"}
            for task in tasks:
                if not isinstance(task, dict):
                    raise ValueError("Each task must be a JSON object")
                if not required_fields.issubset(task.keys()):
                    missing = required_fields - set(task.keys())
                    raise ValueError(f"Task missing required fields: {missing}")

            if users:
                for task in tasks:
                    task_role = task.get("role", "").lower()
                    assignable_users = [
                        user for user in users
                        if user.role.lower() == task_role
                    ]
                    assignable_users_dicts = []
                    for user in assignable_users:
                        user_dict = user.dict()
                        user_dict["match_percentage"] = calculate_match_percentage(task, user)
                        assignable_users_dicts.append(user_dict)
                    assignable_users_dicts.sort(key=lambda x: x["match_percentage"], reverse=True)
                    task["assignableUsers"] = assignable_users_dicts

            return tasks

        except Exception as e:
            if attempt < max_retries - 1:
                logger.warning(f"Attempt {attempt + 1} failed with error: {str(e)}. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2
            else:
                logger.error(f"Failed to generate tasks after {max_retries} attempts: {str(e)}")
                raise Exception(f"Failed to generate tasks after {max_retries} attempts: {str(e)}")

    raise Exception(f"Request failed after {max_retries} retries.")