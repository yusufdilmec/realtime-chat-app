import api from "@/lib/api";
import { type LoginDto, type RegisterDto, type AuthResponse } from "@/types";

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/Auth/Login", data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/Auth/Register", data);
    return response.data;
  },
};
