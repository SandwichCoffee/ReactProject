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
        const requestUrl = error.config?.url ?? "";
        const isAuthRequest = requestUrl.includes("/users/login") || requestUrl.includes("/users/join");

        if (error.response && error.response.status === 401 && !isAuthRequest) {
            // Dispatch logout action
            store.dispatch(logout());

            // HashRouter route
            if (window.location.hash !== "#/login") {
                window.location.hash = "#/login";
            }
        }
        return Promise.reject(error);
    }
);
