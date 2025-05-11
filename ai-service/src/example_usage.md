
# Example script demonstrating how to use the task assignment functionality.


`import os
import json
from dotenv import load_dotenv
from assignment_service import assign_task, estimate_task_time, get_people_with_skills

# Load environment variables
load_dotenv()

def example_assign_task():
    """Example of assigning a task to the most suitable person."""
    task_id = "example-task-id"  # Replace with an actual task ID from your database
    
    try:
        result = assign_task(task_id)
        print(f"Task assigned to: {result['person_name']}")
        print(f"Estimated completion time: {result['eta_hours']} hours")
        return result
    except Exception as e:
        print(f"Error assigning task: {str(e)}")
        return None

def example_estimate_time():
    """Example of estimating time for a specific person to complete a task."""
    task_description = "Implement user authentication with OAuth2 and JWT tokens"
    person_id = "A001"  # Replace with an actual person ID from your database
    
    try:
        estimated_hours = estimate_task_time(task_description, person_id)
        print(f"Estimated time for person {person_id}: {estimated_hours} hours")
        return estimated_hours
    except Exception as e:
        print(f"Error estimating time: {str(e)}")
        return None

def example_find_people():
    """Example of finding people with relevant skills for a task."""
    task_description = "Design a responsive dashboard with data visualization components"
    
    try:
        people = get_people_with_skills(task_description)
        print(f"Found {len(people)} people with relevant skills:")
        for person in people:
            skills = [s["skillName"] for s in person.get("skills", [])]
            print(f"- {person['name']} ({person['role']}): {', '.join(skills)}")
        return people
    except Exception as e:
        print(f"Error finding people: {str(e)}")
        return None

if __name__ == "__main__":
    # Choose which example to run
    print("=== Finding People with Relevant Skills ===")
    example_find_people()
    
    print("\n=== Estimating Task Completion Time ===")
    example_estimate_time()
    
    print("\n=== Assigning Task to Most Suitable Person ===")
    example_assign_task()`