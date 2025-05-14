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

// Scheduling management
export const getUserByPRojectID = (id) => axiosInstance.get(`http://localhost:8082/api/users/${id}`);
export const getTaskByProjectID = (id) => axiosInstance.get(`http://localhost:8082/api/tasks/${id}`);
export const getSprintByProjectID = (id) => axiosInstance.get(`http://localhost:8082/api/sprints/${id}`);
export const getSprintDetails = (id) => axiosInstance.get(`http://localhost:8082/api/sprint/${id}`);
export const assignUserToTask = async (projectId, tasks) => {
  const response = await fetch(`http://localhost:8082/api/assign-users-to-tasks?projectId=${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tasks),
      });

  if (!response.ok) throw new Error('Failed to generate tasks from meeting notes');
  return response.json();
};

// Task service 
export const updateTask = (id, data) => axiosInstance.put(`http://localhost:8081/api/tasks/${id}`, data);
export const deleteTask = (id) => axiosInstance.delete(`http://localhost:8081/api/tasks/${id}`);
export const addTask = (id, data) => axiosInstance.post(`http://localhost:8081/api/tasks/sprint/${id}`, data);
export const processMeetingNotes = async (meetingNote) => {

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
export const getTaskByMileStone = (id) => axiosInstance.get(`http://localhost:8081/api/tasks/milestone/${id}`);

