import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const feeCollection = collection(db, "fee");

const createFee = async (data) => {
  const newFee = {
    ...data,
  };

  const docRef = await addDoc(feeCollection, newFee);
  return { id: docRef.id, ...newFee };
};

const getAllFees = async () => {
  const snapshot = await getDocs(feeCollection);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

const getFeesByStratum = async (stratum) => {
  const q = query(feeCollection, where("stratum", "==", stratum));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

const updateFee = async (id, data) => {
  const feeRef = doc(db, "fee", id);

  const updatedData = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(feeRef, updatedData);
  return { id, ...updatedData };
};

const deleteFee = async (id) => {
  const feeRef = doc(db, "fee", id);
  await deleteDoc(feeRef);
  return true;
};

export {
  createFee,
  getAllFees,
  getFeesByStratum,
  updateFee,
  deleteFee
};