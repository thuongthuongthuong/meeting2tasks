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

var usersData = [{
  "_id": ObjectId("6818ca58141f65cabbb62285"),
  "id": 1,
  "name": "User 1 Designer",
  "role": "Designer",
  "avatar": "https://example.com/avatar1.jpg",
  "created_at": new Date("2024-02-15T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca58141f65cabbb62286"),
  "id": 2,
  "name": "User 2 Designer",
  "role": "Designer",
  "avatar": "https://example.com/avatar2.jpg",
  "created_at": new Date("2024-02-20T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca58141f65cabbb62287"),
  "id": 3,
  "name": "User 3 FrontendDeveloper",
  "role": "Frontend Developer",
  "avatar": "https://example.com/avatar3.jpg",
  "created_at": new Date("2024-03-10T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca58141f65cabbb62288"),
  "id": 4,
  "name": "User 4 BackendDeveloper",
  "role": "Backend Developer",
  "avatar": "https://example.com/avatar4.jpg",
  "created_at": new Date("2024-03-15T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca58141f65cabbb62289"),
  "id": 5,
  "name": "User 5 Tester",
  "role": "Tester",
  "avatar": "https://example.com/avatar5.jpg",
  "created_at": new Date("2024-04-01T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca58141f65cabbb6228a"),
  "id": 6,
  "name": "User 6 ProjectManager",
  "role": "Project Manager",
  "avatar": "https://example.com/avatar6.jpg",
  "created_at": new Date("2024-02-10T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca58141f65cabbb6228b"),
  "id": 7,
  "name": "User 7 SecurityEngineer",
  "role": "Security Engineer",
  "avatar": "https://example.com/avatar7.jpg",
  "created_at": new Date("2024-03-05T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca58141f65cabbb6228c"),
  "id": 8,
  "name": "User 8 Researcher",
  "role": "Researcher",
  "avatar": "https://example.com/avatar8.jpg",
  "created_at": new Date("2024-02-25T00:00:00.000Z")
}];

var sprintsData = [{
  "_id": ObjectId("6818caaa141f65cabbb622a5"),
  "id": 1,
  "project_id": 1,
  "name": "Sprint 1 - Core Task Management",
  "description": "Sprint 1 focused on building the core task creation and assignment functionality for the Task Management System.",
  "start_date": new Date("2024-04-01T00:00:00.000Z"),
  "end_date": new Date("2024-04-15T00:00:00.000Z")
},
{
  "_id": ObjectId("6818caaa141f65cabbb622a6"),
  "id": 2,
  "project_id": 1,
  "name": "Sprint 2 - User Interface Enhancement",
  "description": "Sprint 2 focused on designing a user-friendly interface for task visualization and management.",
  "start_date": new Date("2024-04-16T00:00:00.000Z"),
  "end_date": new Date("2024-04-30T00:00:00.000Z")
},
{
  "_id": ObjectId("6818caaa141f65cabbb622a7"),
  "id": 3,
  "project_id": 1,
  "name": "Sprint 3 - Bug Fixes and Optimization",
  "description": "Sprint 3 focused on fixing critical bugs and optimizing performance for better user experience.",
  "start_date": new Date("2024-05-01T00:00:00.000Z"),
  "end_date": new Date("2024-05-15T00:00:00.000Z")
},
{
  "_id": ObjectId("6818caaa141f65cabbb622a8"),
  "id": 4,
  "project_id": 1,
  "name": "Sprint 4 - Security and Final Delivery",
  "description": "Sprint 4 focused on enhancing security measures and finalizing the Task Management System for delivery.",
  "start_date": new Date("2024-05-16T00:00:00.000Z"),
  "end_date": new Date("2024-06-30T00:00:00.000Z")
},
{
  "_id": ObjectId("6818caaa141f65cabbb622a9"),
  "id": 5,
  "project_id": 2,
  "name": "Sprint 1 - Data Ingestion Pipeline",
  "description": "Sprint 1 focused on building the data ingestion pipeline for the Data Analytics Platform.",
  "start_date": new Date("2024-03-01T00:00:00.000Z"),
  "end_date": new Date("2024-03-15T00:00:00.000Z")
},
{
  "_id": ObjectId("6818caaa141f65cabbb622aa"),
  "id": 6,
  "project_id": 2,
  "name": "Sprint 2 - Analytics Dashboard",
  "description": "Sprint 2 focused on developing an analytics dashboard for visualizing data insights.",
  "start_date": new Date("2024-03-16T00:00:00.000Z"),
  "end_date": new Date("2024-03-30T00:00:00.000Z")
},
{
  "_id": ObjectId("6818caaa141f65cabbb622ab"),
  "id": 7,
  "project_id": 2,
  "name": "Sprint 3 - Machine Learning Integration",
  "description": "Sprint 3 focused on integrating machine learning models for predictive analytics.",
  "start_date": new Date("2024-04-01T00:00:00.000Z"),
  "end_date": new Date("2024-04-15T00:00:00.000Z")
},
{
  "_id": ObjectId("6818caaa141f65cabbb622ac"),
  "id": 8,
  "project_id": 2,
  "name": "Sprint 4 - Scalability and Delivery",
  "description": "Sprint 4 focused on improving scalability and delivering the Data Analytics Platform.",
  "start_date": new Date("2024-04-16T00:00:00.000Z"),
  "end_date": new Date("2024-07-15T00:00:00.000Z")
}];

var projectsData = [{
  "_id": ObjectId("6818ca72141f65cabbb6228f"),
  "id": 1,
  "name": "E-commerce Platform Redesign",
  "description": "A comprehensive redesign of an existing e-commerce platform to improve user experience, optimize performance, and enhance security.",
  "created_at": new Date("2024-03-01T00:00:00.000Z"),
  "start_date": new Date("2024-04-01T00:00:00.000Z"),
  "end_date": new Date("2024-06-30T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca72141f65cabbb62290"),
  "id": 2,
  "name": "Healthcare Patient Portal",
  "description": "Development of a secure patient portal for a healthcare provider, featuring appointment scheduling and medical record access.",
  "created_at": new Date("2024-02-15T00:00:00.000Z"),
  "start_date": new Date("2024-03-01T00:00:00.000Z"),
  "end_date": new Date("2024-07-15T00:00:00.000Z")
}];

var projectMembersData = [{
  "_id": ObjectId("6818ca8f141f65cabbb62293"),
  "user_id": 1,
  "project_id": 1,
  "joined_at": new Date("2024-04-05T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb62294"),
  "user_id": 2,
  "project_id": 1,
  "joined_at": new Date("2024-04-06T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb62295"),
  "user_id": 3,
  "project_id": 1,
  "joined_at": new Date("2024-04-07T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb62296"),
  "user_id": 4,
  "project_id": 1,
  "joined_at": new Date("2024-04-08T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb62297"),
  "user_id": 5,
  "project_id": 1,
  "joined_at": new Date("2024-04-09T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb62298"),
  "user_id": 6,
  "project_id": 1,
  "joined_at": new Date("2024-04-10T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb62299"),
  "user_id": 7,
  "project_id": 1,
  "joined_at": new Date("2024-04-11T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb6229a"),
  "user_id": 8,
  "project_id": 1,
  "joined_at": new Date("2024-04-12T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb6229b"),
  "user_id": 1,
  "project_id": 2,
  "joined_at": new Date("2024-03-05T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb6229c"),
  "user_id": 2,
  "project_id": 2,
  "joined_at": new Date("2024-03-06T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb6229d"),
  "user_id": 3,
  "project_id": 2,
  "joined_at": new Date("2024-03-07T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb6229e"),
  "user_id": 4,
  "project_id": 2,
  "joined_at": new Date("2024-03-08T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb6229f"),
  "user_id": 5,
  "project_id": 2,
  "joined_at": new Date("2024-03-09T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb622a0"),
  "user_id": 6,
  "project_id": 2,
  "joined_at": new Date("2024-03-10T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb622a1"),
  "user_id": 7,
  "project_id": 2,
  "joined_at": new Date("2024-03-11T00:00:00.000Z")
},
{
  "_id": ObjectId("6818ca8f141f65cabbb622a2"),
  "user_id": 8,
  "project_id": 2,
  "joined_at": new Date("2024-03-12T00:00:00.000Z")
}];

var milestonesData = [{
  "_id": ObjectId("6818cb35141f65cabbb622af"),
  "id": 1,
  "sprint_id": "6818caaa141f65cabbb622a5",
  "name": "Milestone 1 - Delivery Component 1",
  "description": "Milestone 1 to achieve Implement the core functionality of the system in Sprint 1 - Development Module 1",
  "start_date": new Date("2024-04-01T00:00:00.000Z"),
  "end_date": new Date("2024-04-08T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622b0"),
  "id": 2,
  "sprint_id": "6818caaa141f65cabbb622a5",
  "name": "Milestone 2 - Delivery Feature 1",
  "description": "Milestone 2 to achieve Design a user-friendly interface in Sprint 1 - Development Module 1",
  "start_date": new Date("2024-04-09T00:00:00.000Z"),
  "end_date": new Date("2024-04-15T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622b1"),
  "id": 3,
  "sprint_id": "6818caaa141f65cabbb622a6",
  "name": "Milestone 1 - Delivery Component 2",
  "description": "Milestone 1 to achieve Fix critical bugs affecting user experience in Sprint 2 - Development Component 2",
  "start_date": new Date("2024-04-16T00:00:00.000Z"),
  "end_date": new Date("2024-04-23T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622b2"),
  "id": 4,
  "sprint_id": "6818caaa141f65cabbb622a6",
  "name": "Milestone 2 - Delivery Feature 2",
  "description": "Milestone 2 to achieve Conduct thorough performance and load testing in Sprint 2 - Development Component 2",
  "start_date": new Date("2024-04-24T00:00:00.000Z"),
  "end_date": new Date("2024-04-30T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622b3"),
  "id": 5,
  "sprint_id": "6818caaa141f65cabbb622a7",
  "name": "Milestone 1 - Delivery Component 3",
  "description": "Milestone 1 to achieve Enhance security measures against common vulnerabilities in Sprint 3 - Development Feature 3",
  "start_date": new Date("2024-05-01T00:00:00.000Z"),
  "end_date": new Date("2024-05-08T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622b4"),
  "id": 6,
  "sprint_id": "6818caaa141f65cabbb622a7",
  "name": "Milestone 2 - Delivery Feature 3",
  "description": "Milestone 2 to achieve Research cutting-edge technologies for integration in Sprint 3 - Development Feature 3",
  "start_date": new Date("2024-05-09T00:00:00.000Z"),
  "end_date": new Date("2024-05-15T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622b5"),
  "id": 7,
  "sprint_id": "6818caaa141f65cabbb622a8",
  "name": "Milestone 1 - Delivery Component 4",
  "description": "Milestone 1 to achieve Plan and coordinate project milestones and deliverables in Sprint 4 - Development Update 4",
  "start_date": new Date("2024-05-16T00:00:00.000Z"),
  "end_date": new Date("2024-05-23T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622b6"),
  "id": 8,
  "sprint_id": "6818caaa141f65cabbb622a8",
  "name": "Milestone 2 - Delivery Feature 4",
  "description": "Milestone 2 to achieve Finalize the project delivery in Sprint 4 - Development Update 4",
  "start_date": new Date("2024-05-24T00:00:00.000Z"),
  "end_date": new Date("2024-06-30T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622b7"),
  "id": 9,
  "sprint_id": "6818caaa141f65cabbb622a9",
  "name": "Milestone 1 - Delivery Component 1",
  "description": "Milestone 1 to achieve Implement the core functionality of the system in Sprint 1 - Development Module 1",
  "start_date": new Date("2024-03-01T00:00:00.000Z"),
  "end_date": new Date("2024-03-08T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622b8"),
  "id": 10,
  "sprint_id": "6818caaa141f65cabbb622a9",
  "name": "Milestone 2 - Delivery Feature 1",
  "description": "Milestone 2 to achieve Design a user-friendly interface in Sprint 1 - Development Module 1",
  "start_date": new Date("2024-03-09T00:00:00.000Z"),
  "end_date": new Date("2024-03-15T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622b9"),
  "id": 11,
  "sprint_id": "6818caaa141f65cabbb622aa",
  "name": "Milestone 1 - Delivery Component 2",
  "description": "Milestone 1 to achieve Fix critical bugs affecting user experience in Sprint 2 - Development Component 2",
  "start_date": new Date("2024-03-16T00:00:00.000Z"),
  "end_date": new Date("2024-03-23T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622ba"),
  "id": 12,
  "sprint_id": "6818caaa141f65cabbb622aa",
  "name": "Milestone 2 - Delivery Feature 2",
  "description": "Milestone 2 to achieve Conduct thorough performance and load testing in Sprint 2 - Development Component 2",
  "start_date": new Date("2024-03-24T00:00:00.000Z"),
  "end_date": new Date("2024-03-30T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622bb"),
  "id": 13,
  "sprint_id": "6818caaa141f65cabbb622ab",
  "name": "Milestone 1 - Delivery Component 3",
  "description": "Milestone 1 to achieve Enhance security measures against common vulnerabilities in Sprint 3 - Development Feature 3",
  "start_date": new Date("2024-04-01T00:00:00.000Z"),
  "end_date": new Date("2024-04-08T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622bc"),
  "id": 14,
  "sprint_id": "6818caaa141f65cabbb622ab",
  "name": "Milestone 2 - Delivery Feature 3",
  "description": "Milestone 2 to achieve Research cutting-edge technologies for integration in Sprint 3 - Development Feature 3",
  "start_date": new Date("2024-04-09T00:00:00.000Z"),
  "end_date": new Date("2024-04-15T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622bd"),
  "id": 15,
  "sprint_id": "6818caaa141f65cabbb622ac",
  "name": "Milestone 1 - Delivery Component 4",
  "description": "Milestone 1 to achieve Plan and coordinate project milestones and deliverables in Sprint 4 - Development Update 4",
  "start_date": new Date("2024-04-16T00:00:00.000Z"),
  "end_date": new Date("2024-04-23T00:00:00.000Z")
},
{
  "_id": ObjectId("6818cb35141f65cabbb622be"),
  "id": 16,
  "sprint_id": "6818caaa141f65cabbb622ac",
  "name": "Milestone 2 - Delivery Feature 4",
  "description": "Milestone 2 to achieve Finalize the project delivery in Sprint 4 - Development Update 4",
  "start_date": new Date("2024-04-24T00:00:00.000Z"),
  "end_date": new Date("2024-07-15T00:00:00.000Z")
}];

var tasksData = [{
  "_id": ObjectId("6818cccc141f65cabbb622c5"),
  "id": 1,
  "milestone_id": "6818cb35141f65cabbb622af",
  "assigned_user_id": "6818ca58141f65cabbb62285",
  "name": "Task 1 - Work Module 1",
  "description": "Complete Implement the core functionality of the system as part of Milestone 1 - Delivery Component 1",
  "assigned_at": new Date("2024-04-02T00:00:00.000Z"),
  "deadline": new Date("2024-04-07T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 5,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622c6"),
  "id": 2,
  "milestone_id": "6818cb35141f65cabbb622af",
  "assigned_user_id": "6818ca58141f65cabbb62286",
  "name": "Task 2 - Work Component 1",
  "description": "Complete Design a user-friendly interface as part of Milestone 1 - Delivery Component 1",
  "assigned_at": new Date("2024-04-03T00:00:00.000Z"),
  "deadline": new Date("2024-04-08T00:00:00.000Z"),
  "priority": "High",
  "story_points": 3,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622c7"),
  "id": 3,
  "milestone_id": "6818cb35141f65cabbb622af",
  "assigned_user_id": "6818ca58141f65cabbb62287",
  "name": "Task 3 - Work Feature 1",
  "description": "Complete Fix critical bugs affecting user experience as part of Milestone 1 - Delivery Component 1",
  "assigned_at": new Date("2024-04-04T00:00:00.000Z"),
  "deadline": new Date("2024-04-09T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 2,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622c8"),
  "id": 4,
  "milestone_id": "6818cb35141f65cabbb622b0",
  "assigned_user_id": "6818ca58141f65cabbb62288",
  "name": "Task 1 - Work Module 2",
  "description": "Complete Conduct thorough performance and load testing as part of Milestone 2 - Delivery Feature 1",
  "assigned_at": new Date("2024-04-10T00:00:00.000Z"),
  "deadline": new Date("2024-04-15T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 4,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622c9"),
  "id": 5,
  "milestone_id": "6818cb35141f65cabbb622b0",
  "assigned_user_id": "6818ca58141f65cabbb62289",
  "name": "Task 2 - Work Component 2",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 2 - Delivery Feature 1",
  "assigned_at": new Date("2024-04-11T00:00:00.000Z"),
  "deadline": new Date("2024-04-16T00:00:00.000Z"),
  "priority": "High",
  "story_points": 6,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622ca"),
  "id": 6,
  "milestone_id": "6818cb35141f65cabbb622b0",
  "assigned_user_id": "6818ca58141f65cabbb6228a",
  "name": "Task 3 - Work Feature 2",
  "description": "Complete Research cutting-edge technologies for integration as part of Milestone 2 - Delivery Feature 1",
  "assigned_at": new Date("2024-04-12T00:00:00.000Z"),
  "deadline": new Date("2024-04-17T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 1,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622cb"),
  "id": 7,
  "milestone_id": "6818cb35141f65cabbb622b1",
  "assigned_user_id": "6818ca58141f65cabbb62285",
  "name": "Task 1 - Work Module 3",
  "description": "Complete Fix critical bugs affecting user experience as part of Milestone 1 - Delivery Component 2",
  "assigned_at": new Date("2024-04-17T00:00:00.000Z"),
  "deadline": new Date("2024-04-22T00:00:00.000Z"),
  "priority": "High",
  "story_points": 4,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622cc"),
  "id": 8,
  "milestone_id": "6818cb35141f65cabbb622b1",
  "assigned_user_id": "6818ca58141f65cabbb62286",
  "name": "Task 2 - Work Component 3",
  "description": "Complete Conduct thorough performance and load testing as part of Milestone 1 - Delivery Component 2",
  "assigned_at": new Date("2024-04-18T00:00:00.000Z"),
  "deadline": new Date("2024-04-23T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 3,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622cd"),
  "id": 9,
  "milestone_id": "6818cb35141f65cabbb622b1",
  "assigned_user_id": "6818ca58141f65cabbb62287",
  "name": "Task 3 - Work Feature 3",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 1 - Delivery Component 2",
  "assigned_at": new Date("2024-04-19T00:00:00.000Z"),
  "deadline": new Date("2024-04-24T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 2,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622ce"),
  "id": 10,
  "milestone_id": "6818cb35141f65cabbb622b2",
  "assigned_user_id": "6818ca58141f65cabbb62288",
  "name": "Task 1 - Work Module 4",
  "description": "Complete Conduct thorough performance and load testing as part of Milestone 2 - Delivery Feature 2",
  "assigned_at": new Date("2024-04-25T00:00:00.000Z"),
  "deadline": new Date("2024-04-30T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 5,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622cf"),
  "id": 11,
  "milestone_id": "6818cb35141f65cabbb622b2",
  "assigned_user_id": "6818ca58141f65cabbb62289",
  "name": "Task 2 - Work Component 4",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 2 - Delivery Feature 2",
  "assigned_at": new Date("2024-04-26T00:00:00.000Z"),
  "deadline": new Date("2024-05-01T00:00:00.000Z"),
  "priority": "High",
  "story_points": 6,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622d0"),
  "id": 12,
  "milestone_id": "6818cb35141f65cabbb622b2",
  "assigned_user_id": "6818ca58141f65cabbb6228a",
  "name": "Task 3 - Work Feature 4",
  "description": "Complete Research cutting-edge technologies for integration as part of Milestone 2 - Delivery Feature 2",
  "assigned_at": new Date("2024-04-27T00:00:00.000Z"),
  "deadline": new Date("2024-05-02T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 1,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622d1"),
  "id": 13,
  "milestone_id": "6818cb35141f65cabbb622b3",
  "assigned_user_id": "6818ca58141f65cabbb6228b",
  "name": "Task 1 - Work Module 5",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 1 - Delivery Component 3",
  "assigned_at": new Date("2024-05-02T00:00:00.000Z"),
  "deadline": new Date("2024-05-07T00:00:00.000Z"),
  "priority": "High",
  "story_points": 7,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622d2"),
  "id": 14,
  "milestone_id": "6818cb35141f65cabbb622b3",
  "assigned_user_id": "6818ca58141f65cabbb62285",
  "name": "Task 2 - Work Component 5",
  "description": "Complete Research cutting-edge technologies for integration as part of Milestone 1 - Delivery Component 3",
  "assigned_at": new Date("2024-05-03T00:00:00.000Z"),
  "deadline": new Date("2024-05-08T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 4,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622d3"),
  "id": 15,
  "milestone_id": "6818cb35141f65cabbb622b3",
  "assigned_user_id": "6818ca58141f65cabbb62286",
  "name": "Task 3 - Work Feature 5",
  "description": "Complete Plan and coordinate project milestones and deliverables as part of Milestone 1 - Delivery Component 3",
  "assigned_at": new Date("2024-05-04T00:00:00.000Z"),
  "deadline": new Date("2024-05-09T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 3,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622d4"),
  "id": 16,
  "milestone_id": "6818cb35141f65cabbb622b4",
  "assigned_user_id": "6818ca58141f65cabbb62287",
  "name": "Task 1 - Work Module 6",
  "description": "Complete Research cutting-edge technologies for integration as part of Milestone 2 - Delivery Feature 3",
  "assigned_at": new Date("2024-05-10T00:00:00.000Z"),
  "deadline": new Date("2024-05-15T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 5,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622d5"),
  "id": 17,
  "milestone_id": "6818cb35141f65cabbb622b4",
  "assigned_user_id": "6818ca58141f65cabbb62288",
  "name": "Task 2 - Work Component 6",
  "description": "Complete Finalize the project delivery as part of Milestone 2 - Delivery Feature 3",
  "assigned_at": new Date("2024-05-11T00:00:00.000Z"),
  "deadline": new Date("2024-05-16T00:00:00.000Z"),
  "priority": "High",
  "story_points": 6,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622d6"),
  "id": 18,
  "milestone_id": "6818cb35141f65cabbb622b4",
  "assigned_user_id": "6818ca58141f65cabbb62289",
  "name": "Task 3 - Work Feature 6",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 2 - Delivery Feature 3",
  "assigned_at": new Date("2024-05-12T00:00:00.000Z"),
  "deadline": new Date("2024-05-17T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 2,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622d7"),
  "id": 19,
  "milestone_id": "6818cb35141f65cabbb622b5",
  "assigned_user_id": "6818ca58141f65cabbb6228a",
  "name": "Task 1 - Work Module 7",
  "description": "Complete Plan and coordinate project milestones and deliverables as part of Milestone 1 - Delivery Component 4",
  "assigned_at": new Date("2024-05-17T00:00:00.000Z"),
  "deadline": new Date("2024-05-22T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 4,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622d8"),
  "id": 20,
  "milestone_id": "6818cb35141f65cabbb622b5",
  "assigned_user_id": "6818ca58141f65cabbb6228b",
  "name": "Task 2 - Work Component 7",
  "description": "Complete Finalize the project delivery as part of Milestone 1 - Delivery Component 4",
  "assigned_at": new Date("2024-05-18T00:00:00.000Z"),
  "deadline": new Date("2024-05-23T00:00:00.000Z"),
  "priority": "High",
  "story_points": 7,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622d9"),
  "id": 21,
  "milestone_id": "6818cb35141f65cabbb622b5",
  "assigned_user_id": "6818ca58141f65cabbb62285",
  "name": "Task 3 - Work Feature 7",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 1 - Delivery Component 4",
  "assigned_at": new Date("2024-05-19T00:00:00.000Z"),
  "deadline": new Date("2024-05-24T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 3,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622da"),
  "id": 22,
  "milestone_id": "6818cb35141f65cabbb622b6",
  "assigned_user_id": "6818ca58141f65cabbb62286",
  "name": "Task 1 - Work Module 8",
  "description": "Complete Finalize the project delivery as part of Milestone 2 - Delivery Feature 4",
  "assigned_at": new Date("2024-05-25T00:00:00.000Z"),
  "deadline": new Date("2024-06-01T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 5,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622db"),
  "id": 23,
  "milestone_id": "6818cb35141f65cabbb622b6",
  "assigned_user_id": "6818ca58141f65cabbb62287",
  "name": "Task 2 - Work Component 8",
  "description": "Complete Plan and coordinate project milestones and deliverables as part of Milestone 2 - Delivery Feature 4",
  "assigned_at": new Date("2024-05-26T00:00:00.000Z"),
  "deadline": new Date("2024-06-02T00:00:00.000Z"),
  "priority": "High",
  "story_points": 6,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622dc"),
  "id": 24,
  "milestone_id": "6818cb35141f65cabbb622b6",
  "assigned_user_id": "6818ca58141f65cabbb62288",
  "name": "Task 3 - Work Feature 8",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 2 - Delivery Feature 4",
  "assigned_at": new Date("2024-05-27T00:00:00.000Z"),
  "deadline": new Date("2024-06-30T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 2,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622dd"),
  "id": 25,
  "milestone_id": "6818cb35141f65cabbb622b7",
  "assigned_user_id": "6818ca58141f65cabbb62289",
  "name": "Task 1 - Work Module 9",
  "description": "Complete Implement the core functionality of the system as part of Milestone 1 - Delivery Component 1",
  "assigned_at": new Date("2024-03-02T00:00:00.000Z"),
  "deadline": new Date("2024-03-07T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 4,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622de"),
  "id": 26,
  "milestone_id": "6818cb35141f65cabbb622b7",
  "assigned_user_id": "6818ca58141f65cabbb6228a",
  "name": "Task 2 - Work Component 9",
  "description": "Complete Design a user-friendly interface as part of Milestone 1 - Delivery Component 1",
  "assigned_at": new Date("2024-03-03T00:00:00.000Z"),
  "deadline": new Date("2024-03-08T00:00:00.000Z"),
  "priority": "High",
  "story_points": 5,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622df"),
  "id": 27,
  "milestone_id": "6818cb35141f65cabbb622b7",
  "assigned_user_id": "6818ca58141f65cabbb6228b",
  "name": "Task 3 - Work Feature 9",
  "description": "Complete Fix critical bugs affecting user experience as part of Milestone 1 - Delivery Component 1",
  "assigned_at": new Date("2024-03-04T00:00:00.000Z"),
  "deadline": new Date("2024-03-09T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 3,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622e0"),
  "id": 28,
  "milestone_id": "6818cb35141f65cabbb622b8",
  "assigned_user_id": "6818ca58141f65cabbb62285",
  "name": "Task 1 - Work Module 10",
  "description": "Complete Design a user-friendly interface as part of Milestone 2 - Delivery Feature 1",
  "assigned_at": new Date("2024-03-10T00:00:00.000Z"),
  "deadline": new Date("2024-03-15T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 6,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622e1"),
  "id": 29,
  "milestone_id": "6818cb35141f65cabbb622b8",
  "assigned_user_id": "6818ca58141f65cabbb62286",
  "name": "Task 2 - Work Component 10",
  "description": "Complete Conduct thorough performance and load testing as part of Milestone 2 - Delivery Feature 1",
  "assigned_at": new Date("2024-03-11T00:00:00.000Z"),
  "deadline": new Date("2024-03-16T00:00:00.000Z"),
  "priority": "High",
  "story_points": 4,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622e2"),
  "id": 30,
  "milestone_id": "6818cb35141f65cabbb622b8",
  "assigned_user_id": "6818ca58141f65cabbb62287",
  "name": "Task 3 - Work Feature 10",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 2 - Delivery Feature 1",
  "assigned_at": new Date("2024-03-12T00:00:00.000Z"),
  "deadline": new Date("2024-03-17T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 2,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622e3"),
  "id": 31,
  "milestone_id": "6818cb35141f65cabbb622b9",
  "assigned_user_id": "6818ca58141f65cabbb62288",
  "name": "Task 1 - Work Module 11",
  "description": "Complete Fix critical bugs affecting user experience as part of Milestone 1 - Delivery Component 2",
  "assigned_at": new Date("2024-03-17T00:00:00.000Z"),
  "deadline": new Date("2024-03-22T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 5,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622e4"),
  "id": 32,
  "milestone_id": "6818cb35141f65cabbb622b9",
  "assigned_user_id": "6818ca58141f65cabbb62289",
  "name": "Task 2 - Work Component 11",
  "description": "Complete Conduct thorough performance and load testing as part of Milestone 1 - Delivery Component 2",
  "assigned_at": new Date("2024-03-18T00:00:00.000Z"),
  "deadline": new Date("2024-03-23T00:00:00.000Z"),
  "priority": "High",
  "story_points": 6,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622e5"),
  "id": 33,
  "milestone_id": "6818cb35141f65cabbb622b9",
  "assigned_user_id": "6818ca58141f65cabbb6228a",
  "name": "Task 3 - Work Feature 11",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 1 - Delivery Component 2",
  "assigned_at": new Date("2024-03-19T00:00:00.000Z"),
  "deadline": new Date("2024-03-24T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 3,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622e6"),
  "id": 34,
  "milestone_id": "6818cb35141f65cabbb622ba",
  "assigned_user_id": "6818ca58141f65cabbb6228b",
  "name": "Task 1 - Work Module 12",
  "description": "Complete Conduct thorough performance and load testing as part of Milestone 2 - Delivery Feature 2",
  "assigned_at": new Date("2024-03-25T00:00:00.000Z"),
  "deadline": new Date("2024-03-30T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 4,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622e7"),
  "id": 35,
  "milestone_id": "6818cb35141f65cabbb622ba",
  "assigned_user_id": "6818ca58141f65cabbb62285",
  "name": "Task 2 - Work Component 12",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 2 - Delivery Feature 2",
  "assigned_at": new Date("2024-03-26T00:00:00.000Z"),
  "deadline": new Date("2024-03-31T00:00:00.000Z"),
  "priority": "High",
  "story_points": 5,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622e8"),
  "id": 36,
  "milestone_id": "6818cb35141f65cabbb622ba",
  "assigned_user_id": "6818ca58141f65cabbb62286",
  "name": "Task 3 - Work Feature 12",
  "description": "Complete Research cutting-edge technologies for integration as part of Milestone 2 - Delivery Feature 2",
  "assigned_at": new Date("2024-03-27T00:00:00.000Z"),
  "deadline": new Date("2024-04-01T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 2,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622e9"),
  "id": 37,
  "milestone_id": "6818cb35141f65cabbb622bb",
  "assigned_user_id": "6818ca58141f65cabbb62287",
  "name": "Task 1 - Work Module 13",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 1 - Delivery Component 3",
  "assigned_at": new Date("2024-04-02T00:00:00.000Z"),
  "deadline": new Date("2024-04-07T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 6,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622ea"),
  "id": 38,
  "milestone_id": "6818cb35141f65cabbb622bb",
  "assigned_user_id": "6818ca58141f65cabbb62288",
  "name": "Task 2 - Work Component 13",
  "description": "Complete Research cutting-edge technologies for integration as part of Milestone 1 - Delivery Component 3",
  "assigned_at": new Date("2024-04-03T00:00:00.000Z"),
  "deadline": new Date("2024-04-08T00:00:00.000Z"),
  "priority": "High",
  "story_points": 4,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622eb"),
  "id": 39,
  "milestone_id": "6818cb35141f65cabbb622bb",
  "assigned_user_id": "6818ca58141f65cabbb62289",
  "name": "Task 3 - Work Feature 13",
  "description": "Complete Plan and coordinate project milestones and deliverables as part of Milestone 1 - Delivery Component 3",
  "assigned_at": new Date("2024-04-04T00:00:00.000Z"),
  "deadline": new Date("2024-04-09T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 3,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622ec"),
  "id": 40,
  "milestone_id": "6818cb35141f65cabbb622bc",
  "assigned_user_id": "6818ca58141f65cabbb6228a",
  "name": "Task 1 - Work Module 14",
  "description": "Complete Research cutting-edge technologies for integration as part of Milestone 2 - Delivery Feature 3",
  "assigned_at": new Date("2024-04-10T00:00:00.000Z"),
  "deadline": new Date("2024-04-15T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 5,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622ed"),
  "id": 41,
  "milestone_id": "6818cb35141f65cabbb622bc",
  "assigned_user_id": "6818ca58141f65cabbb6228b",
  "name": "Task 2 - Work Component 14",
  "description": "Complete Finalize the project delivery as part of Milestone 2 - Delivery Feature 3",
  "assigned_at": new Date("2024-04-11T00:00:00.000Z"),
  "deadline": new Date("2024-04-16T00:00:00.000Z"),
  "priority": "High",
  "story_points": 6,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622ee"),
  "id": 42,
  "milestone_id": "6818cb35141f65cabbb622bc",
  "assigned_user_id": "6818ca58141f65cabbb62285",
  "name": "Task 3 - Work Feature 14",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 2 - Delivery Feature 3",
  "assigned_at": new Date("2024-04-12T00:00:00.000Z"),
  "deadline": new Date("2024-04-17T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 2,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622ef"),
  "id": 43,
  "milestone_id": "6818cb35141f65cabbb622bd",
  "assigned_user_id": "6818ca58141f65cabbb62286",
  "name": "Task 1 - Work Module 15",
  "description": "Complete Plan and coordinate project milestones and deliverables as part of Milestone 1 - Delivery Component 4",
  "assigned_at": new Date("2024-04-17T00:00:00.000Z"),
  "deadline": new Date("2024-04-22T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 4,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622f0"),
  "id": 44,
  "milestone_id": "6818cb35141f65cabbb622bd",
  "assigned_user_id": "6818ca58141f65cabbb62287",
  "name": "Task 2 - Work Component 15",
  "description": "Complete Finalize the project delivery as part of Milestone 1 - Delivery Component 4",
  "assigned_at": new Date("2024-04-18T00:00:00.000Z"),
  "deadline": new Date("2024-04-23T00:00:00.000Z"),
  "priority": "High",
  "story_points": 7,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622f1"),
  "id": 45,
  "milestone_id": "6818cb35141f65cabbb622bd",
  "assigned_user_id": "6818ca58141f65cabbb62288",
  "name": "Task 3 - Work Feature 15",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 1 - Delivery Component 4",
  "assigned_at": new Date("2024-04-19T00:00:00.000Z"),
  "deadline": new Date("2024-04-24T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 3,
  "type": "Bug"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622f2"),
  "id": 46,
  "milestone_id": "6818cb35141f65cabbb622be",
  "assigned_user_id": "6818ca58141f65cabbb62289",
  "name": "Task 1 - Work Module 16",
  "description": "Complete Finalize the project delivery as part of Milestone 2 - Delivery Feature 4",
  "assigned_at": new Date("2024-04-25T00:00:00.000Z"),
  "deadline": new Date("2024-07-05T00:00:00.000Z"),
  "priority": "Medium",
  "story_points": 5,
  "type": "Feature"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622f3"),
  "id": 47,
  "milestone_id": "6818cb35141f65cabbb622be",
  "assigned_user_id": "6818ca58141f65cabbb6228a",
  "name": "Task 2 - Work Component 16",
  "description": "Complete Plan and coordinate project milestones and deliverables as part of Milestone 2 - Delivery Feature 4",
  "assigned_at": new Date("2024-04-26T00:00:00.000Z"),
  "deadline": new Date("2024-07-10T00:00:00.000Z"),
  "priority": "High",
  "story_points": 8,
  "type": "Task"
},
{
  "_id": ObjectId("6818cccc141f65cabbb622f4"),
  "id": 48,
  "milestone_id": "6818cb35141f65cabbb622be",
  "assigned_user_id": "6818ca58141f65cabbb6228b",
  "name": "Task 3 - Work Feature 16",
  "description": "Complete Enhance security measures against common vulnerabilities as part of Milestone 2 - Delivery Feature 4",
  "assigned_at": new Date("2024-04-27T00:00:00.000Z"),
  "deadline": new Date("2024-07-15T00:00:00.000Z"),
  "priority": "Low",
  "story_points": 4,
  "type": "Bug"
}];

var chatSessionsData = [{
  "_id": ObjectId("6818cd42141f65cabbb622f7"),
  "id": 1,
  "project_id": 1,
  "started_at": new Date("2024-04-10T10:00:00.000Z"),
  "ended_at": new Date("2024-04-12T16:00:00.000Z")
},
{
  "_id": ObjectId("6818cd42141f65cabbb622f8"),
  "id": 2,
  "project_id": 1,
  "started_at": new Date("2024-05-01T09:00:00.000Z"),
  "ended_at": new Date("2024-05-03T15:00:00.000Z")
},
{
  "_id": ObjectId("6818cd42141f65cabbb622f9"),
  "id": 3,
  "project_id": 2,
  "started_at": new Date("2024-03-10T08:00:00.000Z"),
  "ended_at": new Date("2024-03-12T14:00:00.000Z")
},
{
  "_id": ObjectId("6818cd42141f65cabbb622fa"),
  "id": 4,
  "project_id": 2,
  "started_at": new Date("2024-04-01T11:00:00.000Z"),
  "ended_at": new Date("2024-04-03T17:00:00.000Z")
}];

var chatHistoryData = [{
  "_id": ObjectId("6818cd53141f65cabbb622fd"),
  "id": 1,
  "chat_session_id": 1,
  "sender": "user",
  "message": "Discussing the latest sprint progress for E-commerce redesign.",
  "sent_at": new Date("2024-04-10T10:30:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb622fe"),
  "id": 2,
  "chat_session_id": 1,
  "sender": "bot",
  "message": "Need clarification on task priorities for the UI redesign.",
  "sent_at": new Date("2024-04-10T11:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb622ff"),
  "id": 3,
  "chat_session_id": 1,
  "sender": "user",
  "message": "Proposing a new feature for the checkout page.",
  "sent_at": new Date("2024-04-11T09:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62300"),
  "id": 4,
  "chat_session_id": 1,
  "sender": "bot",
  "message": "Reporting a bug in the payment gateway integration.",
  "sent_at": new Date("2024-04-11T14:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62301"),
  "id": 5,
  "chat_session_id": 1,
  "sender": "user",
  "message": "Planning the next milestone review for security enhancements.",
  "sent_at": new Date("2024-04-12T15:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62302"),
  "id": 6,
  "chat_session_id": 2,
  "sender": "bot",
  "message": "Discussing the latest sprint progress for the final testing phase.",
  "sent_at": new Date("2024-05-01T09:30:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62303"),
  "id": 7,
  "chat_session_id": 2,
  "sender": "user",
  "message": "Need clarification on task priorities for the performance testing.",
  "sent_at": new Date("2024-05-01T10:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62304"),
  "id": 8,
  "chat_session_id": 2,
  "sender": "bot",
  "message": "Proposing a new feature for the user dashboard.",
  "sent_at": new Date("2024-05-02T08:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62305"),
  "id": 9,
  "chat_session_id": 2,
  "sender": "user",
  "message": "Reporting a bug in the backend API response time.",
  "sent_at": new Date("2024-05-02T13:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62306"),
  "id": 10,
  "chat_session_id": 2,
  "sender": "bot",
  "message": "Planning the next milestone review for deployment.",
  "sent_at": new Date("2024-05-03T14:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62307"),
  "id": 11,
  "chat_session_id": 3,
  "sender": "user",
  "message": "Discussing the latest sprint progress for the Healthcare Portal.",
  "sent_at": new Date("2024-03-10T08:30:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62308"),
  "id": 12,
  "chat_session_id": 3,
  "sender": "bot",
  "message": "Need clarification on task priorities for the appointment scheduling module.",
  "sent_at": new Date("2024-03-10T09:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62309"),
  "id": 13,
  "chat_session_id": 3,
  "sender": "user",
  "message": "Proposing a new feature for telemedicine integration.",
  "sent_at": new Date("2024-03-11T10:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb6230a"),
  "id": 14,
  "chat_session_id": 3,
  "sender": "bot",
  "message": "Reporting a bug in the medical record access system.",
  "sent_at": new Date("2024-03-11T12:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb6230b"),
  "id": 15,
  "chat_session_id": 3,
  "sender": "user",
  "message": "Planning the next milestone review for HIPAA compliance.",
  "sent_at": new Date("2024-03-12T13:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb6230c"),
  "id": 16,
  "chat_session_id": 4,
  "sender": "bot",
  "message": "Discussing the latest sprint progress for the security phase.",
  "sent_at": new Date("2024-04-01T11:30:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb6230d"),
  "id": 17,
  "chat_session_id": 4,
  "sender": "user",
  "message": "Need clarification on task priorities for the encryption implementation.",
  "sent_at": new Date("2024-04-01T12:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb6230e"),
  "id": 18,
  "chat_session_id": 4,
  "sender": "bot",
  "message": "Proposing a new feature for user authentication.",
  "sent_at": new Date("2024-04-02T09:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb6230f"),
  "id": 19,
  "chat_session_id": 4,
  "sender": "user",
  "message": "Reporting a bug in the patient data privacy module.",
  "sent_at": new Date("2024-04-02T14:00:00.000Z")
},
{
  "_id": ObjectId("6818cd53141f65cabbb62310"),
  "id": 20,
  "chat_session_id": 4,
  "sender": "bot",
  "message": "Planning the next milestone review for final testing.",
  "sent_at": new Date("2024-04-03T16:00:00.000Z")
}];

// Hàm import dữ liệu
function importData(collectionName, data) {
    print("Importing data into collection: " + collectionName);
    try {
        db[collectionName].insertMany(data);
        print("Inserted " + data.length + " documents into " + collectionName);
    } catch (e) {
        print("Error importing " + collectionName + ": " + e);
    }
}

// Thực hiện import
importData("users", usersData);
importData("projects", projectsData);
importData("project_members", projectMembersData);
importData("sprints", sprintsData);
importData("milestones", milestonesData);
importData("tasks", tasksData);
importData("chat_sessions", chatSessionsData);
importData("chat_history", chatHistoryData);

// In số lượng bản ghi
print("Users created: " + db.users.countDocuments({}));
print("Projects created: " + db.projects.countDocuments({}));
print("Project Members created: " + db.project_members.countDocuments({}));
print("Sprints created: " + db.sprints.countDocuments({}));
print("Milestones created: " + db.milestones.countDocuments({}));
print("Tasks created: " + db.tasks.countDocuments({}));
print("Chat Sessions created: " + db.chat_sessions.countDocuments({}));
print("Chat History created: " + db.chat_history.countDocuments({}));