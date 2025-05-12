export const getUserByProjectID = async (projectId) => {
  const response = await fetch(`http://localhost:8082/api/users/${projectId}`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const getSprintIdsByProjectId = async (projectId) => {
  const response = await fetch(`http://localhost:8082/api/sprints/${projectId}`);
  if (!response.ok) throw new Error('Failed to fetch sprint IDs');
  return response.json();
};

export const getSprintWithTasks = async (sprintId) => {
  const response = await fetch(`http://localhost:8082/api/sprint/${sprintId}`);
  if (!response.ok) throw new Error('Failed to fetch sprint details');
  return response.json();
};

export const fetchTasksByMilestone = async (milestoneId) => {
  const response = await fetch(`http://localhost:8081/api/tasks/milestone/${milestoneId}`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export const createTask = async (sprintId, taskDTO) => {
  const response = await fetch(`http://localhost:8081/api/tasks/sprint/${sprintId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskDTO),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

export const updateTask = async (taskId, taskDTO) => {
  const response = await fetch(`http://localhost:8081/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskDTO),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};

export const deleteTask = async (taskId) => {
  const response = await fetch(`http://localhost:8081/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return response.json();
};

export const completeSprint = async (sprintId) => {
  const response = await fetch(`http://localhost:8082/api/sprint/${sprintId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'completed' }),
  });
  if (!response.ok) throw new Error('Failed to complete sprint');
  return response.json();
};

export const generateTasksFromMeetingNotes = async (meetingNote) => {
  const response = await fetch(`http://localhost:8081/api/tasks/meeting-notes`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ meetingNote }),
  });
  if (!response.ok) throw new Error('Failed to generate tasks from meeting notes');
  return response.json();
};