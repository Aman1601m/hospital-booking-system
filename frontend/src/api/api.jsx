import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// AUTH
export const loginUser = (data) => API.post("/users/login", data);
export const registerUser = (data) => API.post("/users/register", data);

// USERS
export const getAllUsers = () => API.get("/users");
export const toggleUserStatus = (id) => API.put(`/users/toggle/${id}`);

// APPOINTMENTS
export const createAppointment = (data) => API.post("/appointments", data);
export const getMyAppointments = () => API.get("/appointments/my");
export const getAllAppointments = () => API.get("/appointments/all");

export const approveAppointment = (id, data) =>
  API.put(`/appointments/approve/${id}`, data);

export const rejectAppointment = (id, data) =>
  API.put(`/appointments/reject/${id}`, data);

export const updateAppointmentDate = (id, data) =>
  API.put(`/appointments/update-date/${id}`, data);

export const deleteAppointment = (id) =>
  API.delete(`/appointments/${id}`);

// PDF
export const downloadPDF = (id) =>
  `${API.defaults.baseURL}/appointments/pdf/${id}`;