import { auth } from '../config/firebase';

export async function getAuthHeader() {
  const user = auth.currentUser;

  // Usuario no logueado -> no mandamos header Authorization
  if (!user) {
    return {};
  }

  // OJO: getIdToken() devuelve el JWT que validamos en Spring Boot
  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}