from datetime import datetime
from dateutil.relativedelta import relativedelta
from pymongo import MongoClient


# get document from MongoDB base on project_id
db_name = "meeting2tasks"
mongo_uri = "mongodb://localhost:27017"

# Connect to MongoDB
client = MongoClient(mongo_uri)
# collection = client[db_name][collection]

def get_document_by_project_id(project_id):
    """
    Retrieve a document from MongoDB based on project_id.
    {
        "_id": {
            "$oid": "682058ad6a2bd870b1d86222"
        },
        "id": 1,
        "milestone_id": 1,
        "assigned_user_id": 7,
        "name": "Task 1 - Work Test 1",
        "description": "Complete Conduct thorough performance and load testing. as part of Milestone 1 - Delivery Module 1",
        "assigned_at": {
            "$date": "2024-04-01T16:22:42.272Z"
        },
        "deadline": {
            "$date": "2024-04-08T02:08:04.171Z"
        },
        "priority": "Low",
        "story_points": 8,
        "type": "Task"
    }
    """
    collection = client[db_name]["project"]
    doc = collection.find_one({"_id": project_id})
    if not doc:
        raise ValueError(f"No document found for project_id: {project_id}")
    return doc

def get_task_by_project_id(project_id):
    """
    Retrieve tasks from MongoDB based on project_id.
    """
    collection = client[db_name]["tasks"]
    tasks = list(collection.find({"projectId": project_id}))
    if not tasks:
        raise ValueError(f"No tasks found for project_id: {project_id}")
    return tasks



def calculate_time_interval(created_at, pushed_at):
    # Parse ISO date strings
    start = datetime.fromisoformat(created_at.rstrip("Z"))
    end = datetime.fromisoformat(pushed_at.rstrip("Z"))

    # Calculate time delta
    delta = relativedelta(end, start)

    # Build duration string
    parts = []
    if delta.years: parts.append(f"{delta.years} year{'s' if delta.years > 1 else ''}")
    if delta.months: parts.append(f"{delta.months} month{'s' if delta.months > 1 else ''}")
    if delta.days >= 7:
        weeks = delta.days // 7
        parts.append(f"{weeks} week{'s' if weeks > 1 else ''}")
        delta.days %= 7
    if delta.days: parts.append(f"{delta.days} day{'s' if delta.days > 1 else ''}")

    return " ".join(parts) if parts else "0 days"



def create_description(doc):
    desc = doc["description"]

    desc += " " + calculate_time_interval(
        doc["startDate"].isoformat(),
        doc["endDate"].isoformat()
    )

    # Strip all the special characters
    desc = "".join(e for e in desc if e.isalnum() or e.isspace())

    return desc