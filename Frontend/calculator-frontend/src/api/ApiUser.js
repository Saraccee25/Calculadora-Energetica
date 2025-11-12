import { db } from "../config/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const getUserDataApi = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data();
  return { id: docSnap.id, ...data };
};

const updateUserDataApi = async (email, newData) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userRef = doc(db, "users", querySnapshot.docs[0].id);
    await updateDoc(userRef, newData);
  }
};

const getAllUsersApi = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export { getUserDataApi, updateUserDataApi, getAllUsersApi };
