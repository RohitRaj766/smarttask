import { useMutation } from "@tanstack/react-query";
import { userService, UpdateProfilePayload, ChangePasswordPayload } from "../services/user.service";
import { useAuth } from "../context/auth.context";

export const useUpdateProfile = () => {
  const { refreshProfile } = useAuth();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateProfile(payload),
    onSuccess: async () => {
      await refreshProfile();
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => userService.changePassword(payload),
  });
};
