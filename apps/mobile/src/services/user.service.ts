import { apiClient } from "./api.client";
import { ISuccessResponse, IUser } from "../types";

export interface UpdateProfilePayload {
  name: string;
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword?: string;
}

export const userService = {
  async updateProfile(payload: UpdateProfilePayload): Promise<ISuccessResponse<IUser>> {
    const res = await apiClient.patch<ISuccessResponse<IUser>>("/user/profile", payload);
    return res.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<ISuccessResponse<null>> {
    const res = await apiClient.post<ISuccessResponse<null>>("/user/change-password", payload);
    return res.data;
  },
};
