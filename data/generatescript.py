# generate_sample_data.py

import random
import uuid
from datetime import datetime, timedelta
from pymongo import MongoClient

# ─── Configuration ──────────────────────────────────────────────────────────────
MONGO_URI                = "mongodb+srv://HaQuangHuy:123@taskassignmentdb.o6geekw.mongodb.net/"
DB_NAME                  = "task_assignment_db"
NUM_SKILLS               = 25
NUM_PERSONS              = 30
NUM_TASKS                = 100
NUM_PROJECTS             = 15
MAX_SKILLS_PER_PERSON    = 5
MAX_TASKS_PER_PROJECT    = 15
ASSIGNMENTS_PER_TASK     = 2
MAX_LOGS_PER_ASSIGNMENT  = 3

ROLES       = ["Designer", "Analyst", "Developer", "Tester", "Manager"]
SENIORITY   = ["intern", "fresher", "junior", "senior", "lead"]
DEPARTMENTS = ["Engineering", "Marketing", "Sales", "HR", "Finance"]

# ─── Name & Skill Pools ─────────────────────────────────────────────────────────
first_names = [
    "Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack",
    "Kathy", "Leo", "Mona", "Nick", "Olivia", "Pete", "Quinn", "Rachel", "Sam", "Tina",
    "Uma", "Victor", "Wendy", "Xander", "Yvonne", "Zack", "Amber", "Brian", "Cindy", "Daniel"
]

last_names = [
    "Nguyen", "Tran", "Le", "Pham", "Hoang", "Huynh", "Phan", "Vu", "Vo", "Dang",
    "Bui", "Do", "Ho", "Ngo", "Duong", "Ly", "Luong", "Dinh", "Trinh", "Mai",
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"
]

skill_names = [
    "UI Design", "Data Entry", "Project Management", "Python Programming", "JavaScript",
    "Machine Learning", "Graphic Design", "Copywriting", "SEO", "Digital Marketing",
    "Financial Analysis", "Customer Service", "Quality Assurance", "DevOps", "Cloud Architecture",
    "Blockchain Development", "UX Research", "Content Strategy", "Video Editing", "Sales",
    "Public Speaking", "Data Visualization", "Network Security", "Mobile Development", "Product Management"
]

# ─── ID Generators ──────────────────────────────────────────────────────────────
person_counters    = {}
skill_counter      = 0
project_counter    = 0
assignment_counter = 0

def generate_person_id(name):
    """First-letter of first name + 3-digit counter (A001, B002, etc.)."""
    initial = name.strip().split()[0][0].upper()
    count = person_counters.get(initial, 0) + 1
    person_counters[initial] = count
    return f"{initial}{count:03d}"

def generate_skill_id():
    """SKL001, SKL002, ..."""
    global skill_counter
    skill_counter += 1
    return f"SKL{skill_counter:03d}"

def generate_project_id():
    """PRJ001, PRJ002, ..."""
    global project_counter
    project_counter += 1
    return f"PRJ{project_counter:03d}"

def generate_assignment_id():
    """ASM001, ASM002, ..."""
    global assignment_counter
    assignment_counter += 1
    return f"ASM{assignment_counter:03d}"

def new_uuid():
    return str(uuid.uuid4())

def random_date(start_days_ago=180, end_days_ago=0):
    start = datetime.now() - timedelta(days=start_days_ago)
    end   = datetime.now() - timedelta(days=end_days_ago)
    return start + (end - start) * random.random()

# ─── Connect & Create Indexes ───────────────────────────────────────────────────
client = MongoClient(MONGO_URI)
db     = client[DB_NAME]

db.skills.create_index("skillId", unique=True)
db.people.create_index("personId", unique=True)
db.personSkills.create_index("personId")
db.personSkills.create_index("skillId")
db.taskMaster.create_index("taskId", unique=True)
db.project.create_index("projectId", unique=True)
db.assignments.create_index("assignmentId", unique=True)
db.timeLogs.create_index("timeLogId", unique=True)

# ─── Generate & Insert Sample Data ──────────────────────────────────────────────

# 1) skills
skills = []
for name in skill_names:
    sid = generate_skill_id()
    skills.append({
        "skillId": sid,
        "skillName": name,
        "skillDescription": ""
    })
db.skills.insert_many(skills)

# 2) people
people = []
for _ in range(30):
    fn = random.choice(first_names)
    ln = random.choice(last_names)
    full_name = f"{fn} {ln}"
    pid = generate_person_id(full_name)
    people.append({
        "personId": pid,
        "name": full_name,
        "role": "Analyst",           # or random.choice(...)
        "capacityHours": 40.0,       # adjust as needed
        "seniority": "junior",       # or random.choice(...)
        "departments": ["Engineering"],
        "joinDate": datetime.now()
    })
db.people.insert_many(people)

# 3) personSkills
person_skills = []
for p in people:
    chosen = random.sample(skills, k=random.randint(1, MAX_SKILLS_PER_PERSON))
    for sk in chosen:
        person_skills.append({
            "personId": p["personId"],
            "skillId": sk["skillId"],
            "proficiency": random.randint(1, 5)
        })
db.personSkills.insert_many(person_skills)

# 4) taskMaster
tasks = []
for i in range(NUM_TASKS):
    tid     = new_uuid()
    created = random_date(start_days_ago=180)
    tasks.append({
        "taskId": tid,
        "taskName": f"Task {i+1}",
        "description": f"Auto-generated description for task {i+1}",
        "requiredHours": round(random.uniform(1, 8), 1),
        "createdAt": created
    })
db.taskMaster.insert_many(tasks)

# 5) project
projects = []
for i in range(NUM_PROJECTS):
    prid       = generate_project_id()
    chosen     = random.sample(tasks, k=random.randint(1, min(MAX_TASKS_PER_PROJECT, NUM_TASKS)))
    start_date = random_date(start_days_ago=120, end_days_ago=60)
    end_date   = random_date(start_days_ago=59)
    projects.append({
        "projectId": prid,
        "projectName": f"Project {i+1}",
        "description": f"Auto-generated project {i+1}",
        "ownerId": random.choice(people)["personId"],
        "taskIds": [t["taskId"] for t in chosen],
        "startDate": start_date,
        "endDate": end_date
    })
db.project.insert_many(projects)

# 6) assignments
assignments = []
for t in tasks:
    for _ in range(ASSIGNMENTS_PER_TASK):
        aid       = generate_assignment_id()
        person    = random.choice(people)
        assigned  = random_date(start_days_ago=90, end_days_ago=30)
        due_date  = assigned + timedelta(days=random.randint(1, 30))
        assignments.append({
            "assignmentId": aid,
            "taskId": t["taskId"],
            "personId": person["personId"],
            "assignedAt": assigned,
            "dueDate": due_date,
            "status": random.choice(["completed", "in_progress"])
        })
db.assignments.insert_many(assignments)

# 7) timeLogs
time_logs = []
for a in assignments:
    for _ in range(random.randint(1, MAX_LOGS_PER_ASSIGNMENT)):
        lid      = new_uuid()
        start    = a["assignedAt"] + timedelta(hours=random.randint(0, 5))
        duration = random.uniform(0.5, 4.0)
        end      = start + timedelta(hours=duration)
        time_logs.append({
            "timeLogId": lid,
            "assignmentId": a["assignmentId"],
            "personId": a["personId"],
            "startTime": start,
            "endTime": end,
            "durationHours": round(duration, 2),
            "notes": ""
        })
db.timeLogs.insert_many(time_logs)

print("✔️  Sample data generation complete 2!")
