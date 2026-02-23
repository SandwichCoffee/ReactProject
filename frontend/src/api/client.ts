import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/slices/authSlice";

const BASE_URL = import.meta.env.MODE === 'production'
    ? "https://reactproject-q472.onrender.com"
    : "http://localhost:8088";

export const client = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

// Request Interceptor: Add Token
client.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.user?.token; // Assuming user object has a token field

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle 401
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Dispatch logout action
            store.dispatch(logout());
            // Optional: Redirect to login page if not already there
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
