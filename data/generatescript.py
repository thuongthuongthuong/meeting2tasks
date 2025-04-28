# generate_sample_data.py

import random
import uuid
from datetime import datetime, timedelta
from pymongo import MongoClient

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

skill_descriptions = {
    "UI Design":           "Design intuitive and visually appealing user interfaces for web and mobile apps.",
    "Data Entry":          "Accurately input, update, and maintain data in systems and spreadsheets.",
    "Project Management":  "Plan, execute, and oversee projects to ensure they meet scope, budget, and timeline.",
    "Python Programming":  "Write, test, and maintain Python code for automation, data analysis, and web services.",
    "JavaScript":          "Develop interactive web features and client-side logic using JavaScript.",
    "Machine Learning":    "Build and train models to uncover patterns and make data-driven predictions.",
    "Graphic Design":      "Create visual assets—logos, layouts, and illustrations—for digital and print media.",
    "Copywriting":         "Craft clear, persuasive text for marketing materials, ads, and websites.",
    "SEO":                 "Optimize website content and structure to improve search engine rankings.",
    "Digital Marketing":   "Plan and execute online campaigns across channels like social and email.",
    "Financial Analysis":  "Interpret financial data to guide budgeting, forecasting, and investment decisions.",
    "Customer Service":    "Assist and resolve customer inquiries to maintain satisfaction and loyalty.",
    "Quality Assurance":   "Test products and processes to ensure they meet defined quality standards.",
    "DevOps":              "Automate and streamline software deployment, infrastructure, and monitoring.",
    "Cloud Architecture":  "Design and manage scalable, secure cloud-based systems and services.",
    "Blockchain Development": "Develop decentralized applications and smart contracts on blockchain platforms.",
    "UX Research":         "Conduct user studies and analyze feedback to inform product design decisions.",
    "Content Strategy":    "Plan and oversee content creation to meet business goals and audience needs.",
    "Video Editing":       "Edit and assemble raw footage into polished videos for various channels.",
    "Sales":               "Identify leads, pitch products, and close deals to drive revenue.",
    "Public Speaking":     "Deliver engaging presentations and speeches to inform or persuade audiences.",
    "Data Visualization":  "Turn complex data into clear, interactive charts and dashboards.",
    "Network Security":    "Protect networks and systems by monitoring, detecting, and responding to threats.",
    "Mobile Development":  "Build and maintain native or cross-platform mobile applications.",
    "Product Management":  "Define product vision, roadmap, and features to deliver user value."
}

project_templates = [
    ("Digital Transformation Initiative",
     "Implement end-to-end digital processes to modernize legacy systems and improve operational agility."),
    ("Customer Experience Enhancement",
     "Redefine customer journey touchpoints to increase satisfaction and retention across channels."),
    ("Mobile App Launch",
     "Develop and launch a cross-platform mobile application to expand market reach and engagement."),
    ("Cloud Infrastructure Migration",
     "Migrate on-premise infrastructure to cloud platforms to enhance scalability and reduce costs."),
    ("Data Warehouse Deployment",
     "Design and deploy a centralized data warehouse for improved reporting and analytics."),
    ("AI Chatbot Implementation",
     "Integrate an AI-driven chatbot to automate customer queries and streamline support operations."),
    ("Website Redesign Campaign",
     "Redesign the corporate website with responsive UX/UI to boost traffic and conversion rates."),
    ("CRM Integration Project",
     "Integrate CRM system with marketing tools to centralize customer data and optimize campaigns."),
    ("E-commerce Platform Upgrade",
     "Upgrade the e-commerce platform with new features to enhance shopping experience and security."),
    ("Cybersecurity Hardening",
     "Implement advanced security measures and protocols to protect against emerging cyber threats."),
    ("Marketing Automation Rollout",
     "Deploy marketing automation solutions to streamline campaign management and lead nurturing."),
    ("Product Line Expansion",
     "Plan and execute the launch of three new product lines to diversify revenue streams."),
    ("Sustainability Compliance Framework",
     "Establish sustainability practices and reporting frameworks to meet regulatory requirements."),
    ("Backend API Performance Tuning",
     "Optimize backend APIs for reduced latency and improved throughput under high load."),
    ("Employee Onboarding Portal",
     "Create a self-service portal to standardize and automate employee onboarding workflows.")
]

verbs = [
    "Design", "Develop", "Test", "Review", "Document", "Deploy", "Optimize", "Analyze", "Plan", "Coordinate",
    "Implement", "Integrate", "Refactor", "Audit", "Investigate", "Monitor", "Maintain", "Upgrade", "Configure",
    "Prototype", "Validate", "Troubleshoot", "Research", "Architect", "Estimate", "Train", "Automate", "Debug",
    "Customize", "Scale"
]

objects = [
    "user login flow", "database schema", "API endpoint", "homepage layout", "reporting dashboard",
    "marketing campaign", "customer survey", "deployment pipeline", "data model", "performance metrics",
    "authentication module", "error handling system", "notification service", "security audit", "UX prototype",
    "accessibility report", "data migration plan", "backup strategy", "logging system", "CI/CD pipeline",
    "email service", "payment gateway", "inventory management module", "chatbot interface", "search function",
    "analytics dashboard", "user profile page", "session management", "role-based access control", "audit log",
    "real-time monitoring", "recommendation engine", "multilingual support module", "export feature",
    "health check endpoint", "feature flag system", "cache mechanism", "thread pool manager", "rate limiter",
    "configuration service"
]

types = [
    "Feature", "Bug", "Chore", "Spike", "Improvement", "Hotfix", "Task",
    "Documentation", "Research", "Maintenance", "Refactor", "Support"
]

priorities = ["Low", "Medium", "High"]

# ─── Configuration ──────────────────────────────────────────────────────────────
MONGO_URI               = "mongodb+srv://***:***@***/"
DB_NAME                 = "task_assignment_db"

NUM_SKILLS              = 25
NUM_PERSONS             = 30
NUM_PROJECTS            = len(project_templates)
MAX_SKILLS_PER_PERSON   = 5
MAX_TASKS_PER_PROJECT   = 15
ASSIGNMENTS_PER_TASK    = 2
MAX_LOGS_PER_ASSIGNMENT = 3

ROLES       = ["Designer", "Analyst", "Developer", "Tester", "Manager"]
SENIORITY   = ["intern", "fresher", "junior", "senior", "lead"]
DEPARTMENTS = ["Engineering", "Marketing", "Sales", "HR", "Finance"]

# ─── ID Generators ──────────────────────────────────────────────────────────────
person_counters    = {}
skill_counter      = 0
project_counter    = 0
assignment_counter = 0
sprint_counter     = 0
milestone_counter  = 0
chat_session_counter = 0
chat_history_counter = 0

def generate_person_id(name):
    initial = name.strip().split()[0][0].upper()
    cnt = person_counters.get(initial, 0) + 1
    person_counters[initial] = cnt
    return f"{initial}{cnt:03d}"

def generate_skill_id():
    global skill_counter; skill_counter += 1
    return f"SKL{skill_counter:03d}"

def generate_project_id():
    global project_counter; project_counter += 1
    return f"PRJ{project_counter:03d}"

def generate_assignment_id():
    global assignment_counter; assignment_counter += 1
    return f"ASM{assignment_counter:03d}"

def generate_sprint_id():
    global sprint_counter; sprint_counter += 1
    return f"SPR{ sprint_counter:03d}"

def generate_milestone_id():
    global milestone_counter; milestone_counter += 1
    return f"MSL{ milestone_counter:03d}"

def generate_chat_session_id():
    global chat_session_counter; chat_session_counter += 1
    return f"CHS{ chat_session_counter:03d}"

def generate_chat_history_id():
    global chat_history_counter; chat_history_counter += 1
    return f"CHH{ chat_history_counter:03d}"

def new_uuid():
    return str(uuid.uuid4())

def random_date(start_days_ago=180, end_days_ago=0):
    a = datetime.now() - timedelta(days=start_days_ago)
    b = datetime.now() - timedelta(days=end_days_ago)
    return a + (b - a) * random.random()

# ─── Connect & Index ────────────────────────────────────────────────────────────
client = MongoClient(MONGO_URI)
db     = client[DB_NAME]

# core collections
db.skills.create_index("skillId", unique=True)
db.people.create_index("personId", unique=True)
db.personSkills.create_index("personId")
db.personSkills.create_index("skillId")
db.taskMaster.create_index("taskId", unique=True)
db.project.create_index("projectId", unique=True)
db.assignments.create_index("assignmentId", unique=True)
db.timeLogs.create_index("timeLogId", unique=True)

# new collections
db.projectMembers.create_index([("personId",1),("projectId",1)], unique=True)
db.sprints.create_index("sprintId", unique=True)
db.sprints.create_index("projectId")
db.milestones.create_index("milestoneId", unique=True)
db.milestones.create_index("sprintId")
db.chatSessions.create_index("chatSessionId", unique=True)
db.chatSessions.create_index("projectId")
db.chatHistory.create_index("chatHistoryId", unique=True)
db.chatHistory.create_index("chatSessionId")

# ─── Generate & Insert ──────────────────────────────────────────────────────────

# 1) skills
skills = []
for name in skill_names:
    sid = generate_skill_id()
    skills.append({
        "skillId": sid,
        "skillName": name,
        "skillDescription": skill_descriptions[name]
    })
db.skills.insert_many(skills)

# 2) people (+ avatar)
people = []
for _ in range(NUM_PERSONS):
    fn, ln = random.choice(first_names), random.choice(last_names)
    full_name = f"{fn} {ln}"
    pid = generate_person_id(full_name)
    people.append({
        "personId": pid,
        "name": full_name,
        "role": random.choice(ROLES),
        "avatar": f"https://example.com/avatars/{pid}.png",
        "capacityHours": round(random.uniform(28,50),1),
        "seniority": random.choice(SENIORITY),
        "departments": random.sample(DEPARTMENTS, k=random.randint(1,2)),
        "joinDate": random_date(start_days_ago=365)
    })
db.people.insert_many(people)

# 3) personSkills
pskills = []
for p in people:
    chosen = random.sample(skills, k=random.randint(1, MAX_SKILLS_PER_PERSON))
    for sk in chosen:
        pskills.append({
            "personId": p["personId"],
            "skillId": sk["skillId"],
            "proficiency": random.randint(1,5)
        })
db.personSkills.insert_many(pskills)

# 4) project
projects = []
for name, desc in project_templates:
    prid = generate_project_id()
    start = random_date(120, 60)
    end   = random_date(59, 0)
    projects.append({
        "projectId":   prid,
        "projectName": name,
        "description": desc,
        "createdAt":   random_date(200,180),
        "startDate":   start,
        "endDate":     end
    })
db.project.insert_many(projects)

# 5) projectMembers
pmembers = []
for proj in projects:
    members = random.sample(people, k=random.randint(3,6))
    for m in members:
        pmembers.append({
            "personId":  m["personId"],
            "projectId": proj["projectId"],
            "joinedAt":  proj["startDate"] + timedelta(days=random.randint(0,30))
        })
db.projectMembers.insert_many(pmembers)

# 6) sprints & milestones
sprints    = []
milestones = []
for proj in projects:
    for _ in range(random.randint(2, 4)):
        sid = generate_sprint_id()
        # sprints start and end dates
        s_start = random_date( (proj["startDate"] - datetime.now()).days + 120,  60 )
        s_end   = s_start + timedelta(days=random.randint(7, 21))
        sprints.append({
            "sprintId":    sid,
            "projectId":   proj["projectId"],
            "name":        f"Sprint {sid[-3:]}",
            "description": f"Work block for {proj['projectName']}",
            "startDate":   s_start,
            "endDate":     s_end   
        })

        # milestones per sprint
        for mi in range(random.randint(1, 3)):
            mid     = generate_milestone_id()
            # m_start and m_end too
            m_start = s_start + timedelta(days=mi * 5)
            m_end   = m_start + timedelta(days=random.randint(2, 10))
            milestones.append({
                "milestoneId": mid,
                "sprintId":    sid,
                "name":         f"Milestone {mid[-3:]}",
                "description":  f"Goal {mi+1} of {sid}",
                "startDate":    m_start,
                "endDate":      m_end   
            })

db.sprints.insert_many(sprints)
db.milestones.insert_many(milestones)

# 7) taskMaster (now hooking to real milestoneIds)
tasks = []
for _ in range( len(sprints)*5 ):  # ~5 tasks per sprint
    verb, obj = random.choice(verbs), random.choice(objects)
    tid = new_uuid()
    tasks.append({
        "taskId":        tid,
        "taskName":      f"{verb} {obj}",
        "description":   f"{verb} and complete the {obj}.",
        "requiredHours": round(random.uniform(2,16),1),
        "createdAt":     random_date(90,0),
        "priority":      random.choices(priorities,[1,3,1])[0],
        "storyPoints":   random.choice([1,2,3,5,8]),
        "type":          random.choice(types),
        "milestoneId":   random.choice(milestones)["milestoneId"]
    })
db.taskMaster.insert_many(tasks)

# 8) assignments
assignments = []
for t in tasks:
    for _ in range(ASSIGNMENTS_PER_TASK):
        aid = generate_assignment_id()
        p = random.choice(people)
        a = random_date(90,30)
        assignments.append({
            "assignmentId": aid,
            "taskId":       t["taskId"],
            "personId":     p["personId"],
            "assignedAt":   a,
            "dueDate":      (a + timedelta(days=random.randint(1,30))),
            "status":       random.choice(["completed","in_progress"])
        })
db.assignments.insert_many(assignments)

# 9) timeLogs
time_logs = []
for a in assignments:
    for _ in range(random.randint(1,MAX_LOGS_PER_ASSIGNMENT)):
        lid = new_uuid()
        s   = a["assignedAt"] + timedelta(hours=random.randint(0,5))
        dur = random.uniform(0.5,4.0)
        time_logs.append({
            "timeLogId":     lid,
            "assignmentId":  a["assignmentId"],
            "personId":      a["personId"],
            "startTime":     s,
            "endTime":       s + timedelta(hours=dur),
            "durationHours": round(dur,2),
            "notes":         ""
        })
db.timeLogs.insert_many(time_logs)

# 10) chatSessions & chatHistory
chat_sessions = []
chat_history  = []
for proj in projects:
    for _ in range(random.randint(1,3)):
        csid = generate_chat_session_id()
        start = random_date( proj["startDate"].day, proj["endDate"].day )
        end   = start + timedelta(minutes=random.randint(15,120))
        chat_sessions.append({
            "chatSessionId": csid,
            "projectId":     proj["projectId"],
            "startedAt":     start,
            "endedAt":       end
        })
        # generate some messages
        for i in range(random.randint(5,20)):
            chhid = generate_chat_history_id()
            ts    = start + timedelta(seconds= random.randint(30, (end-start).seconds ))
            chat_history.append({
                "chatHistoryId":   chhid,
                "chatSessionId":   csid,
                "sender":          random.choice(["user","bot"]),
                "message":         f"Sample message {i+1}",
                "sentAt":          ts
            })

db.chatSessions.insert_many(chat_sessions)
db.chatHistory.insert_many(chat_history)

print("✔️  All collections generated and populated!")
