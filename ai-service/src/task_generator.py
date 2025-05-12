import os
import json
import logging
from openai import OpenAI
from dotenv import load_dotenv
from rag import query_with_adapter
from utils import create_description, get_document_by_project_id

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
def strip_markdown_fences(content: str) -> str:
    content = content.strip()
    if content.startswith("```json"):
        content = content.removeprefix("```json").removesuffix("```").strip()
    elif content.startswith("```"):
        content = content.removeprefix("```").removesuffix("```").strip()
    return content

def get_task_json(user_input: str, project_id = None) -> list:
    project_doc = get_document_by_project_id(project_id)
    desc = create_description(project_doc)
    relevant_project = query_with_adapter

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

        return tasks

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse OpenAI response as JSON: {str(e)}")
        raise ValueError(f"OpenAI response is not valid JSON: {str(e)}")
    except Exception as e:
        logger.error(f"Error generating tasks: {str(e)}")
        raise