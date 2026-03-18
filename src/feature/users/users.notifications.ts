import { UserNotificationTemplates } from "./users.config";
import { UserCreatedNotificationData } from "./users.types";

export const usersNotificationRegistry = {
  [UserNotificationTemplates.USER_CREATED.key]: (
    data: UserCreatedNotificationData,
  ) => ({
    title: "Welcome to the Platform!",
    message: `Welcome ${data.userName || "to our platform"}! Your account has been created successfully.`,
    action: {
      label: "Complete Profile",
      url: `/dashboard/profile/${data.userId}`,
      type: "primary" as const,
    },
    metadata: {
      userId: data.userId,
      registrationMethod: data.registrationMethod || "standard",
    },
  }),
};
