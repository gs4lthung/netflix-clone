import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: false,
  isLoggingOut: false,
  isLogginIn: false,
  signup: async (credentials: JSON) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("/api/v1/auth/signup", credentials);
      set({ user: res.data.user, isSigningUp: false });
      toast.success("Account created successful");
    } catch (error) {
      const errorResponse = error as { response: { data: { message: string } } };
      toast.error(errorResponse.response.data.message || "An error occurred");
      set({ user: null, isSigningUp: false });
    }
  },
  login: async (credentials: JSON) => {
    set({ isLogginIn: true });
    try {
      const res = await axios.post("/api/v1/auth/login", credentials);
      set({ user: res.data.user, isLogginIn: false });
    } catch (error) {
      set({ user: null, isLogginIn: false });
      const errorResponse = error as { response: { data: { message: string } } };
      toast.error(errorResponse.response.data.message || "An error occurred");
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post("/api/v1/auth/logout");
      set({ user: null, isLoggingOut: false });

    } catch (error) {
      set({ user: null, isLoggingOut: false });
      const errorResponse = error as { response: { data: { message: string } } };
      toast.error(errorResponse.response.data.message || "An error occurred");
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get("/api/v1/auth/authCheck");
      set({ user: res.data.user, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
    }
  },
}));
