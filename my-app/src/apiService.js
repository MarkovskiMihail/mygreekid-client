import axios from "axios";

const API_BASE_URL = "https://appointments-server-1-8e83aec0397d.herokuapp.com";

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add interceptor to attach token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const getAppointments = async () => {
  const response = await api.get("/appointments");
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post("/appointments", appointmentData);
  return response.data;
};

// Add other API methods as needed
