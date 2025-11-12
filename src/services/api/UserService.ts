import { api } from "./index";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "staff" | "admin";
  is_verified: boolean;
  is_2fa_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
}

class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<{ data: User }> {
    const response = await api.get<{ data: User }>("/users/me");
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: UpdateUserDto
  ): Promise<{ data: User }> {
    const response = await api.put<{ data: User }>(`/users/${userId}`, data);
    return response.data;
  }
}

export default new UserService();
