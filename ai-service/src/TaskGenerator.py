# src/task_generator.py

import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def strip_markdown_fences(content: str):
    if content.strip().startswith("```json"):
        return content.strip().removeprefix("```json").removesuffix("```").strip()
    return content

def get_task_json(user_input: str, project_id: int = None):
    project_id_text = "null" if project_id is None else project_id

    system_prompt = f"""
    You are an AI assistant for project management. Your job is to extract structured task data from the user's input and return it strictly in JSON format.

    Your response must include only a valid JSON array of objects and nothing else — no comments, explanations, or formatting outside the JSON.

    Return one JSON object per task you find in the input. The output format should be:

    [
      {{
        "id": "string",
        "milestone_id": "string,
        "assigned_user_id": "string",
        "name": "string",
        "description": "string",
        "assigned_at": "timestamp",
        "deadline": "timestamp"
      }}
    ]

    the "name" field should be the task name, and the "description" field should be the task description. 


    If a value is missing or not specified, use null.
    """

    user_prompt = f"Here is the user input:\n{user_input}"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt.strip()},
            {"role": "user", "content": user_prompt.strip()}
        ],
        temperature=0
    )

    raw_output = response.choices[0].message.content
    print(f"Raw output: {raw_output}")
    clean_output = strip_markdown_fences(raw_output)
    return json.loads(clean_output)
