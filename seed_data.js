// Kết nối tới database meeting2tasks
db = db.getSiblingDB("meeting2tasks");

// Xóa dữ liệu cũ
db.users.drop();
db.projects.drop();
db.project_members.drop();
db.sprints.drop();
db.milestones.drop();
db.tasks.drop();

// Tạo danh sách vai trò
var roles = ["Developer", "Manager", "Tester", "Designer"];
var priorities = ["Low", "Medium", "High"];
var taskTypes = ["Bug", "Feature", "Task"];
var statuses = ["To Do", "In Progress", "Done"];

// Hàm tạo ngày ngẫu nhiên
function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Tạo Users (50 người dùng)
var users = [];
for (var i = 1; i <= 50; i++) {
    users.push({
        _id: "user" + i,
        name: "User " + i,
        role: roles[Math.floor(Math.random() * roles.length)],
        avatar: "https://example.com/avatar" + i + ".jpg",
        created_at: getRandomDate(new Date("2024-01-01"), new Date("2025-04-01"))
    });
}
db.users.insertMany(users);

// Tạo Projects (10 dự án)
var projects = [];
for (var i = 1; i <= 10; i++) {
    var startDate = getRandomDate(new Date("2024-01-01"), new Date("2025-01-01"));
    var endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000); // +90 ngày
    projects.push({
        _id: "project" + i,
        name: "Project " + i,
        description: "Description for Project " + i,
        created_at: new Date("2024-01-01"),
        start_date: startDate,
        end_date: endDate
    });
}
db.projects.insertMany(projects);

// Tạo Project Members (70 bản ghi, mỗi project có 5-10 thành viên)
var projectMembers = [];
var userIndex = 0;
for (var i = 1; i <= 10; i++) {
    var numMembers = Math.floor(Math.random() * 6) + 5; // 5-10 thành viên
    for (var j = 0; j < numMembers; j++) {
        userIndex = (userIndex % 50) + 1; // Quay vòng danh sách user
        projectMembers.push({
            _id: "pm_" + i + "_" + j,
            user_id: "user" + userIndex,
            project_id: "project" + i,
            joined_at: getRandomDate(new Date("2024-01-01"), new Date("2025-04-01"))
        });
        userIndex++;
    }
}
db.project_members.insertMany(projectMembers);

// Tạo Sprints (40 sprint, mỗi project có 3-5 sprint)
var sprints = [];
for (var i = 1; i <= 10; i++) {
    var projectStart = projects[i-1].start_date;
    var projectEnd = projects[i-1].end_date;
    var numSprints = Math.floor(Math.random() * 3) + 3; // 3-5 sprint
    var sprintDuration = 14 * 24 * 60 * 60 * 1000; // 14 ngày mỗi sprint
    var currentStart = new Date(projectStart.getTime());

    for (var j = 1; j <= numSprints; j++) {
        var sprintEnd = new Date(currentStart.getTime() + sprintDuration);
        if (sprintEnd > projectEnd) break; // Không vượt quá ngày kết thúc project
        sprints.push({
            _id: "sprint_project" + i + "_" + j,
            project_id: "project" + i,
            name: "Sprint " + j,
            description: "Sprint " + j + " for Project " + i,
            start_date: new Date(currentStart),
            end_date: new Date(sprintEnd)
        });
        currentStart = new Date(sprintEnd.getTime() + 24 * 60 * 60 * 1000); // Bắt đầu sprint tiếp theo sau khi sprint hiện tại kết thúc
    }
}
db.sprints.insertMany(sprints);

// Tạo Milestones (120 milestone, mỗi sprint có 2-4 milestone)
var milestones = [];
for (var i = 0; i < sprints.length; i++) {
    var sprint = sprints[i];
    var sprintStart = new Date(sprint.start_date);
    var sprintEnd = new Date(sprint.end_date);
    var numMilestones = Math.floor(Math.random() * 3) + 2; // 2-4 milestone
    var milestoneDuration = (sprintEnd.getTime() - sprintStart.getTime()) / numMilestones;
    var currentStart = new Date(sprintStart.getTime());

    for (var j = 1; j <= numMilestones; j++) {
        var milestoneEnd = new Date(currentStart.getTime() + milestoneDuration);
        milestones.push({
            _id: "milestone_sprint_project" + sprint.project_id.split("project")[1] + "_" + sprint.name.split(" ")[1] + "_" + j,
            sprint_id: sprint._id,
            name: "Milestone " + j,
            description: "Milestone " + j + " for " + sprint._id,
            start_date: new Date(currentStart),
            end_date: new Date(milestoneEnd)
        });
        currentStart = new Date(milestoneEnd.getTime());
    }
}
db.milestones.insertMany(milestones);

// Tạo Tasks (500 task, mỗi milestone có 3-5 task)
var tasks = [];
for (var i = 0; i < milestones.length; i++) {
    var milestone = milestones[i];
    var sprintId = milestone.sprint_id;
    var projectId = sprints.find(s => s._id === sprintId).project_id;
    var members = db.project_members.find({ project_id: projectId }).toArray();
    var numTasks = Math.floor(Math.random() * 3) + 3; // 3-5 task

    for (var j = 1; j <= numTasks; j++) {
        var assignedUser = members[Math.floor(Math.random() * members.length)].user_id;
        tasks.push({
            _id: "task_milestone_sprint_project" + projectId.split("project")[1] + "_" + sprintId.split("_")[2] + "_" + milestone.name.split(" ")[1] + "_" + j,
            milestone_id: milestone._id,
            assigned_user_id: assignedUser,
            name: "Task " + j + " for " + milestone._id,
            description: "Description for Task " + j,
            assigned_at: getRandomDate(new Date(milestone.start_date), new Date(milestone.end_date)),
            deadline: getRandomDate(new Date(milestone.start_date), new Date(milestone.end_date)),
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            story_points: Math.floor(Math.random() * 5) + 1, // 1-5 points
            type: taskTypes[Math.floor(Math.random() * taskTypes.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            meetingNoteId: null
        });
    }
}
db.tasks.insertMany(tasks);

// In số lượng bản ghi được tạo
print("Users created: " + db.users.countDocuments({}));
print("Projects created: " + db.projects.countDocuments({}));
print("Project Members created: " + db.project_members.countDocuments({}));
print("Sprints created: " + db.sprints.countDocuments({}));
print("Milestones created: " + db.milestones.countDocuments({}));
print("Tasks created: " + db.tasks.countDocuments({}));