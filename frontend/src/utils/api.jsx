import axiosInstance from "./axios";

// ----------------------------------------------------------------------

export const getUserByPRojectID = (id) => axiosInstance.get(`http://localhost:8082/api/users/${id}`);
