import logging
from typing import Dict, List, Optional
from .task_assignment import TaskAssigner

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Singleton instance of TaskAssigner
_task_assigner = None

def get_task_assigner() -> TaskAssigner:
    """
    Returns a singleton instance of TaskAssigner.
    This ensures we only create one connection to MongoDB.
    """
    global _task_assigner
    if _task_assigner is None:
        _task_assigner = TaskAssigner()
    return _task_assigner

def assign_task(task_id: str) -> Dict:
    """
    Assign a task to the most suitable person and estimate completion time.
    
    Args:
        task_id: The ID of the task to assign
        
    Returns:
        Dict with keys:
        - person_name: Name of the assigned person
        - eta_hours: Estimated hours to complete the task
    """
    assigner = get_task_assigner()
    try:
        return assigner.assign_task(task_id)
    except Exception as e:
        logger.error(f"Error assigning task {task_id}: {str(e)}")
        raise

def estimate_task_time(task_description: str, person_id: str) -> float:
    """
    Estimate how long a task will take for a specific person.
    
    Args:
        task_description: Description of the task
        person_id: ID of the person to estimate for
        
    Returns:
        Estimated hours to complete the task
    """
    assigner = get_task_assigner()
    try:
        return assigner.estimate_task_time(task_description, person_id)
    except Exception as e:
        logger.error(f"Error estimating task time: {str(e)}")
        raise

def get_people_with_skills(task_description: str, top_k: int = 5) -> List[Dict]:
    """
    Find people with relevant skills for a task using RAG.
    
    Args:
        task_description: Description of the task
        top_k: Number of people to return
        
    Returns:
        List of people with their skills
    """
    assigner = get_task_assigner()
    try:
        return assigner.get_people_with_skills(task_description, top_k)
    except Exception as e:
        logger.error(f"Error finding people with skills: {str(e)}")
        raise 