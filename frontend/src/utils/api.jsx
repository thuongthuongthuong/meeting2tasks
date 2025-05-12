import axiosInstance from "./axios";

// ----------------------------------------------------------------------

// Scheduling management
export const getUserByPRojectID = (id) => axiosInstance.get(`http://localhost:8082/api/users/${id}`);
export const getTaskByProjectID = (id) => axiosInstance.get(`http://localhost:8082/api/tasks/${id}`);
export const getSprintByProjectID = (id) => axiosInstance.get(`http://localhost:8082/api/sprints/${id}`);
export const getSprintDetails = (id) => axiosInstance.get(`http://localhost:8082/api/sprint/${id}`);

// Task service 
export const updateTask = (id, data) => axiosInstance.put(`http://localhost:8081/api/tasks/${id}`, data);
export const deleteTask = (id) => axiosInstance.delete(`http://localhost:8081/api/tasks/${id}`);
export const addTask = (id, data) => axiosInstance.post(`http://localhost:8081/api/tasks/sprint/${id}`, data);
export const processMeetingNotes = (data) => axiosInstance.post(`http://localhost:8081/api/meeting-notes`, data);
export const getTaskByMileStone = (id) => axiosInstance.get(`http://localhost:8081/api/tasks/milestone/${id}`);