import os
import json
import logging
from openai import OpenAI

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Lấy API key từ biến môi trường
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = OpenAI(api_key=api_key)

def strip_markdown_fences(content: str) -> str:
    """Loại bỏ định dạng Markdown (nếu có) từ nội dung."""
    content = content.strip()
    if content.startswith("```json"):
        content = content.removeprefix("```json").removesuffix("```").strip()
    elif content.startswith("```"):
        content = content.removeprefix("```").removesuffix("```").strip()
    return content

def get_task_json(user_input: str, project_id: int = None) -> list:
    """Tạo danh sách tasks từ user_input bằng OpenAI."""
    project_id_text = "null" if project_id is None else str(project_id)

    system_prompt = f"""
    You are an AI assistant for project management. Your job is to extract structured task data from the user's input and return it strictly in JSON format.

    Your response must include only a valid JSON array of objects and nothing else — no comments, explanations, or formatting outside the JSON.

    Return one JSON object per task you find in the input. The output format should be:

    [
      {{
        "id": "string",
        "title": "string",
        "description": "string",
        "status": "string",
        "assignedUserId": "string",
        "meetingNoteId": "string"
      }}
    ]

    - "id": A unique identifier for the task (generate a UUID if not specified).
    - "title": The task name.
    - "description": The task description.
    - "status": The initial status of the task (default to "To Do" if not specified).
    - "assignedUserId": The ID of the user assigned to the task (default to "user1" if not specified).
    - "meetingNoteId": The ID of the meeting note (use the project_id if provided, otherwise default to "note1").

    If a value is missing or not specified, use the default values mentioned above.
    """

    user_prompt = f"Here is the user input:\n{user_input}\n\nProject ID: {project_id_text}"

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

        # Loại bỏ Markdown fences (nếu có)
        clean_output = strip_markdown_fences(raw_output)
        logger.debug(f"Cleaned output: {clean_output}")

        # Parse JSON
        tasks = json.loads(clean_output)

        # Đảm bảo tasks là một list
        if not isinstance(tasks, list):
            raise ValueError("OpenAI response must be a JSON array")

        # Validate cấu trúc của mỗi task
        required_fields = {"id", "title", "description", "status", "assignedUserId", "meetingNoteId"}
        for task in tasks:
            if not isinstance(task, dict):
                raise ValueError("Each task must be a JSON object")
            if not required_fields.issubset(task.keys()):
                missing = required_fields - set(task.keys())
                raise ValueError(f"Task missing required fields: {missing}")

        return tasks

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse OpenAI response as JSON: {str(e)}")
        raise ValueError(f"OpenAI response is not valid JSON: {str(e)}")
    except Exception as e:
        logger.error(f"Error generating tasks: {str(e)}")
        raise