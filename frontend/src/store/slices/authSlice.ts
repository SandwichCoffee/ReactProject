import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/api/authApi';

// Define Auth State
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

// Get initial user from localStorage if available
const getUserFromStorage = (): User | null => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};

const storedUser = getUserFromStorage();

const initialState: AuthState = {
    user: storedUser,
    isAuthenticated: !!storedUser,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
    },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
