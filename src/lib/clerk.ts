import { getOrCreateDbUser, requireCurrentUserId } from "./syncUser";

export { getOrCreateDbUser, requireCurrentUserId };
export const getCurrentDbUser = getOrCreateDbUser;
