import { auth } from "../config/firebase";
import { getUserDataApi, updateUserDataApi } from "../api/apiUser";

const getProfileData = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await getUserDataApi(user.email);
};

const updateProfileData = async (newData) => {
  const user = auth.currentUser;
  if (!user) return null;
  const userData = await getUserDataApi(user.email);
  if (!userData) return null;
  await updateUserDataApi(userData.email, newData);
};

export { getProfileData, updateProfileData };
