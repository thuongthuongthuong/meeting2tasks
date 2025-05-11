import os
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
import torch
from openai import OpenAI

# Import RAG components
from rag import query_with_adapter

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "task_assignment_db")

# OpenAI API
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Connect to MongoDB
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]

class TaskAssigner:
    def __init__(self):
        self.db = db
    
    def get_task_by_id(self, task_id: str) -> Optional[Dict]:
        """Retrieve task details by ID."""
        return self.db.taskMaster.find_one({"taskId": task_id})
    
    def get_people_with_skills(self, task_description: str, top_k: int = 5) -> List[Dict]:
        """
        Use RAG to find people with relevant skills for a task.
        """
        # Query the vector database for similar tasks and relevant people
        rag_results = query_with_adapter(task_description, top_k=top_k)
        
        # Extract person IDs from RAG results
        relevant_people_ids = []
        for match in rag_results["matches"]:
            if "personId" in match["metadata"]:
                relevant_people_ids.append(match["metadata"]["personId"])
        
        # Get full person details
        relevant_people = list(self.db.people.find({"personId": {"$in": relevant_people_ids}}))
        
        # Get skills for each person
        for person in relevant_people:
            person_skills = list(self.db.personSkills.find({"personId": person["personId"]}))
            skill_ids = [ps["skillId"] for ps in person_skills]
            skills = list(self.db.skills.find({"skillId": {"$in": skill_ids}}))
            person["skills"] = skills
        
        return relevant_people
    
    def get_historical_task_times(self, task_description: str, top_k: int = 5) -> List[Dict]:
        """
        Retrieve historical time logs for similar tasks.
        """
        # Query the vector database for similar tasks
        rag_results = query_with_adapter(task_description, top_k=top_k)
        
        # Extract task IDs from RAG results
        similar_task_ids = []
        for match in rag_results["matches"]:
            if "taskId" in match["metadata"]:
                similar_task_ids.append(match["metadata"]["taskId"])
        
        # Get assignments for these tasks
        assignments = list(self.db.assignments.find({"taskId": {"$in": similar_task_ids}}))
        
        # Get time logs for these assignments
        time_logs = []
        for assignment in assignments:
            logs = list(self.db.timeLogs.find({"assignmentId": assignment["assignmentId"]}))
            for log in logs:
                log["personId"] = assignment["personId"]
                log["taskId"] = assignment["taskId"]
                time_logs.append(log)
        
        return time_logs
    
    def estimate_task_time(self, task_description: str, person_id: str) -> float:
        """
        Estimate how long a task will take for a specific person.
        """
        # Get historical time logs for similar tasks
        historical_logs = self.get_historical_task_times(task_description)
        
        # Filter logs for the specific person
        person_logs = [log for log in historical_logs if log["personId"] == person_id]
        
        if person_logs:
            # Calculate average time if we have data for this person
            avg_time = sum(log["durationHours"] for log in person_logs) / len(person_logs)
            return round(avg_time, 1)
        elif historical_logs:
            # Use overall average if we have no data for this person
            avg_time = sum(log["durationHours"] for log in historical_logs) / len(historical_logs)
            # Add a buffer for uncertainty
            return round(avg_time * 1.2, 1)
        else:
            # Default estimate if no historical data
            return 4.0
    
    def assign_task(self, task_id: str) -> Dict:
        """
        Assign a task to the most suitable person and estimate completion time.
        """
        # Get task details
        task = self.get_task_by_id(task_id)
        if not task:
            raise ValueError(f"Task with ID {task_id} not found")
        
        # Get potential assignees
        potential_assignees = self.get_people_with_skills(task["description"])
        if not potential_assignees:
            raise ValueError(f"No suitable assignees found for task {task_id}")
        
        # Get historical task times
        historical_times = self.get_historical_task_times(task["description"])
        
        # Build a prompt for the LLM
        prompt = self._build_assignment_prompt(task, potential_assignees, historical_times)
        
        # Get assignment recommendation from LLM
        assignment = self._get_llm_recommendation(prompt)
        
        # Create the assignment in the database
        self._create_assignment(task_id, assignment["person_name"], assignment["eta_hours"])
        
        return assignment
    
    def _build_assignment_prompt(self, task: Dict, people: List[Dict], historical_times: List[Dict]) -> str:
        """
        Build a prompt for the LLM to decide on task assignment.
        """
        # Format task information
        task_info = f"Task: {task['taskName']}\nDescription: {task['description']}\n"
        
        # Format people information
        people_info = "Potential assignees:\n"
        for i, person in enumerate(people):
            skills_text = ", ".join([s["skillName"] for s in person.get("skills", [])])
            people_info += f"{i+1}. {person['name']} - Role: {person['role']}, Skills: {skills_text}\n"
        
        # Format historical time information
        history_info = "Similar past tasks:\n"
        for log in historical_times[:5]:  # Limit to 5 examples
            person = self.db.people.find_one({"personId": log["personId"]})
            person_name = person["name"] if person else "Unknown"
            history_info += f"• {person_name} completed a similar task in {log['durationHours']} hours\n"
        
        # Final prompt
        prompt = f"""
        {task_info}
        
        {people_info}
        
        {history_info}
        
        Based on the above information, assign this task to the most suitable person and estimate how long it will take.
        Output your answer as JSON with the format: {{ "person_name": "Full Name", "eta_hours": X.X }}
        """
        
        return prompt
    
    def _get_llm_recommendation(self, prompt: str) -> Dict:
        """
        Get task assignment recommendation from the LLM.
        """
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an AI assistant that helps with task assignment. Your job is to recommend the best person for a task and estimate how long it will take. Respond only with JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0
            )
            
            raw_output = response.choices[0].message.content
            
            # Clean the output and parse JSON
            cleaned_output = raw_output.strip()
            if cleaned_output.startswith("```json"):
                cleaned_output = cleaned_output[7:-3].strip()
            elif cleaned_output.startswith("```"):
                cleaned_output = cleaned_output[3:-3].strip()
            
            return json.loads(cleaned_output)
            
        except Exception as e:
            logger.error(f"Error getting LLM recommendation: {str(e)}")
            # Return a default assignment if LLM fails
            return {"person_name": "Unassigned", "eta_hours": 4.0}
    
    def _create_assignment(self, task_id: str, person_name: str, estimated_hours: float) -> Dict:
        """
        Create a new assignment in the database.
        """
        # Find the person ID from the name
        person = self.db.people.find_one({"name": person_name})
        if not person:
            logger.warning(f"Person '{person_name}' not found in database")
            return None
        
        # Generate a new assignment ID
        assignment_id = f"ASM{self.db.assignments.count_documents({}) + 1:03d}"
        
        # Create the assignment
        now = datetime.now()
        assignment_data = {
            "assignmentId": assignment_id,
            "taskId": task_id,
            "personId": person["personId"],
            "assignedAt": now,
            "dueDate": now + timedelta(hours=estimated_hours*2),  # Set due date to 2x the estimated time
            "status": "not_started",
            "estimatedHours": estimated_hours
        }
        
        # Insert into database
        self.db.assignments.insert_one(assignment_data)
        
        return assignment_data

# Example usage
if __name__ == "__main__":
    assigner = TaskAssigner()
    result = assigner.assign_task("some-task-id")
    print(f"Task assigned to {result['person_name']} with estimated completion time of {result['eta_hours']} hours") 