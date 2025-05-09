// Kết nối tới database meeting2tasks
db = db.getSiblingDB("meeting2tasks");

// Xóa dữ liệu cũ
db.users.drop();
db.projects.drop();
db.project_members.drop();
db.sprints.drop();
db.milestones.drop();
db.tasks.drop();
db.chat_sessions.drop();
db.chat_history.drop();

// Tạo danh sách tham chiếu và hàm hỗ trợ
var roles = ["Designer", "Frontend Developer", "Backend Developer", "Tester", "Security Engineer", "Researcher", "Project Manager"];
var priorities = ["Low", "Medium", "High"];
var taskTypes = ["Bug", "Feature", "Task"];
var statuses = ["To Do", "In Progress", "Done"];

// Hàm tạo ngày ngẫu nhiên trong khoảng
function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Hàm tạo mô tả ngẫu nhiên
function getRandomDescription(prefix) {
    var descriptions = [
        "Implement the core functionality of the system",
        "Design a user-friendly and responsive interface",
        "Fix critical bugs affecting user experience",
        "Conduct thorough performance and load testing",
        "Enhance security measures against common vulnerabilities",
        "Research cutting-edge technologies for integration",
        "Plan and coordinate project milestones and deliverables"
    ];
    return prefix + " " + descriptions[Math.floor(Math.random() * descriptions.length)] + ".";
}

// Hàm tạo tên ngẫu nhiên
function getRandomName(prefix, index) {
    var suffixes = ["Module", "Component", "Feature", "Update", "Test"];
    return prefix + " " + suffixes[Math.floor(Math.random() * suffixes.length)] + " " + index;
}

// Tạo Users (20 người dùng với phân phối vai trò hợp lý)
var users = [];
var roleDistribution = [4, 5, 5, 2, 1, 1, 2]; // Designer:4, Frontend:5, Backend:5, Tester:2, Security:1, Researcher:1, PM:2
var roleIndex = 0;
for (var i = 1; i <= 20; i++) {
    var role = roles[roleIndex];
    users.push({
        id: i,
        name: "User " + i + " " + role.charAt(0).toUpperCase() + role.slice(1).replace(" ", ""),
        role: role,
        avatar: "https://example.com/avatar" + i + ".jpg",
        created_at: getRandomDate(new Date("2024-01-01"), new Date("2025-05-05"))
    });
    roleDistribution[roleIndex]--;
    if (roleDistribution[roleIndex] === 0) roleIndex++;
}
db.users.insertMany(users);
// Note: 20 users with balanced roles to support two projects, names reflect their roles.

// Tạo Projects (2 dự án chi tiết)
var projects = [];
var projectData = [
    {
        id: 1,
        name: "E-commerce Platform Redesign",
        description: "A comprehensive redesign of an existing e-commerce platform to improve user experience, optimize performance, and enhance security. The project aims to integrate modern payment gateways and a responsive mobile interface.",
        created_at: new Date("2024-03-01"),
        start_date: new Date("2024-04-01"),
        end_date: new Date("2024-06-30")
    },
    {
        id: 2,
        name: "Healthcare Patient Portal",
        description: "Development of a secure patient portal for a healthcare provider, featuring appointment scheduling, medical record access, and telemedicine integration. Focus on HIPAA compliance and user data privacy.",
        created_at: new Date("2024-02-15"),
        start_date: new Date("2024-03-01"),
        end_date: new Date("2024-07-15")
    }
];
projects.push(...projectData);
db.projects.insertMany(projects);
// Note: Two detailed projects with specific goals, timelines (3-4 months), and unique descriptions.

// Tạo Project Members (20 bản ghi, mỗi project có 8-10 thành viên)
var projectMembers = [];
var userIndex = 0;
for (var i = 1; i <= 2; i++) {
    var numMembers = Math.floor(Math.random() * 3) + 8; // 8-10 thành viên
    for (var j = 0; j < numMembers; j++) {
        userIndex = (userIndex % 20) + 1;
        projectMembers.push({
            user_id: userIndex,
            project_id: i,
            joined_at: getRandomDate(new Date(projects[i-1].start_date), new Date("2025-05-05"))
        });
        userIndex++;
    }
}
db.project_members.insertMany(projectMembers);
// Note: Many-to-many relationship ensures each project has a diverse team, joined_at aligns with project start.

// Tạo Sprints (10 sprint, mỗi project có 4-5 sprint)
var sprints = [];
for (var i = 0; i < projects.length; i++) {
    var projectStart = projects[i].start_date;
    var projectEnd = projects[i].end_date;
    var numSprints = Math.floor(Math.random() * 2) + 4; // 4-5 sprint
    var sprintDuration = (projectEnd.getTime() - projectStart.getTime()) / numSprints; // Chia đều thời gian
    var currentStart = new Date(projectStart.getTime());

    for (var j = 1; j <= numSprints; j++) {
        var sprintEnd = new Date(currentStart.getTime() + sprintDuration);
        if (sprintEnd > projectEnd) sprintEnd = projectEnd;
        sprints.push({
            id: (i * 5 + j),
            project_id: projects[i].id,
            name: "Sprint " + j + " - " + getRandomName("Development", j),
            description: "Sprint " + j + " focused on " + getRandomDescription("delivering") + " for " + projects[i].name,
            start_date: new Date(currentStart),
            end_date: new Date(sprintEnd)
        });
        currentStart = new Date(sprintEnd.getTime() + 24 * 60 * 60 * 1000);
    }
}
db.sprints.insertMany(sprints);
// Note: 10 sprints total, each with specific goals tied to project objectives, 2-week duration approx.

// Tạo Milestones (20 milestone, mỗi sprint có 2 milestone)
var milestones = [];
for (var i = 0; i < sprints.length; i++) {
    var sprint = sprints[i];
    var sprintStart = new Date(sprint.start_date);
    var sprintEnd = new Date(sprint.end_date);
    var numMilestones = 2; // 2 milestone per sprint
    var milestoneDuration = (sprintEnd.getTime() - sprintStart.getTime()) / numMilestones;
    var currentStart = new Date(sprintStart.getTime());

    for (var j = 1; j <= numMilestones; j++) {
        var milestoneEnd = new Date(currentStart.getTime() + milestoneDuration);
        milestones.push({
            id: (i * 2 + j),
            sprint_id: sprint.id,
            name: "Milestone " + j + " - " + getRandomName("Delivery", j),
            description: "Milestone " + j + " to " + getRandomDescription("achieve") + " in " + sprint.name,
            start_date: new Date(currentStart),
            end_date: new Date(milestoneEnd)
        });
        currentStart = new Date(milestoneEnd.getTime());
    }
}
db.milestones.insertMany(milestones);
// Note: 20 milestones, each with clear deliverables tied to sprint goals.

// Tạo Tasks (60 task, mỗi milestone có 3 task)
var tasks = [];
for (var i = 0; i < milestones.length; i++) {
    var milestone = milestones[i];
    var sprintId = milestone.sprint_id;
    var projectId = sprints.find(s => s.id === sprintId).project_id;
    var members = db.project_members.find({ project_id: projectId }).toArray();
    var numTasks = 3; // 3 task per milestone

    for (var j = 1; j <= numTasks; j++) {
        var assignedUser = members[Math.floor(Math.random() * members.length)].user_id;
        tasks.push({
            id: (i * 3 + j),
            milestone_id: milestone.id,
            assigned_user_id: assignedUser,
            name: "Task " + j + " - " + getRandomName("Work", j),
            description: getRandomDescription("Complete") + " as part of " + milestone.name,
            assigned_at: getRandomDate(new Date(milestone.start_date), new Date(milestone.end_date)),
            deadline: getRandomDate(new Date(milestone.assigned_at || milestone.start_date), new Date(milestone.end_date)),
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            story_points: Math.floor(Math.random() * 8) + 1, // 1-8 points
            type: taskTypes[Math.floor(Math.random() * taskTypes.length)]
        });
    }
}
db.tasks.insertMany(tasks);
// Note: 60 tasks with detailed descriptions, assigned to relevant users based on project membership.

// Tạo Chat Sessions (4 session, 2 cho mỗi project)
var chatSessions = [];
for (var i = 1; i <= 2; i++) {
    var project = projects[i-1];
    var startDate = getRandomDate(project.start_date, project.end_date);
    var endDate = getRandomDate(startDate, project.end_date);
    chatSessions.push({
        id: i,
        project_id: project.id,
        started_at: startDate,
        ended_at: endDate
    });
    chatSessions.push({
        id: i + 2,
        project_id: project.id,
        started_at: getRandomDate(startDate, project.end_date),
        ended_at: getRandomDate(startDate, project.end_date)
    });
}
db.chat_sessions.insertMany(chatSessions);
// Note: 4 chat sessions (2 per project) to simulate project discussions.

// Tạo Chat History (20 tin nhắn, 5 cho mỗi session)
var chatHistory = [];
var messages = [
    "Discussing the latest sprint progress.",
    "Need clarification on task priorities.",
    "Proposing a new feature for the UI.",
    "Reporting a bug in the backend.",
    "Planning the next milestone review."
];
for (var i = 1; i <= 4; i++) {
    var session = chatSessions[i-1];
    for (var j = 1; j <= 5; j++) {
        var sender = (Math.random() > 0.5) ? "user" : "bot";
        chatHistory.push({
            id: (i * 5 + j - 5),
            chat_session_id: session.id,
            sender: sender,
            message: messages[Math.floor(Math.random() * messages.length)],
            sent_at: getRandomDate(session.started_at, session.ended_at)
        });
    }
}
db.chat_history.insertMany(chatHistory);
// Note: 20 chat messages with realistic content, distributed across sessions.

// In số lượng bản ghi được tạo
print("Users created: " + db.users.countDocuments({}));
print("Projects created: " + db.projects.countDocuments({}));
print("Project Members created: " + db.project_members.countDocuments({}));
print("Sprints created: " + db.sprints.countDocuments({}));
print("Milestones created: " + db.milestones.countDocuments({}));
print("Tasks created: " + db.tasks.countDocuments({}));
print("Chat Sessions created: " + db.chat_sessions.countDocuments({}));
print("Chat History created: " + db.chat_history.countDocuments({}));