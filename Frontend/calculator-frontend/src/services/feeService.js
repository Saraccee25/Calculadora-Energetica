import {
  createFee,
  getAllFees,
  getFeesByStratum,
  updateFee,
  deleteFee,
} from "../api/apiFee";

const feeCreate = async (data) => {
  return await createFee(data);
};

const feeGetAll = async () => {
  return await getAllFees();
};

const feeGetByStratum = async (stratum) => {
  return await getFeesByStratum(stratum);
};

const feeUpdate = async (id, data) => {
  return await updateFee(id, data);
};

const feeDelete = async (id) => {
  return await deleteFee(id);
};

export {
  feeCreate,
  feeGetAll,
  feeGetByStratum,
  feeUpdate,
  feeDelete
};
