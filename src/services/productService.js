import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const getAllProducts = (page, limit) => {
  return axios.get(`${API_BASE_URL}/get-all-medicines?page=${page}&limit=${limit}`);
};

const getMedicineById = (id) => {
  return axios.get(`${API_BASE_URL}/get-medicine-by-id`, { params: { id } });
};

const createProduct = (data) => {
  return axios.post(`${API_BASE_URL}/create-product`, data);
};
const deleteProduct = (userId) => {
  return axios.delete(`${API_BASE_URL}/delete-medicine`, {
    data: {
      id: userId,
    },
  });
};
const updateProduct = (inputData) => {
  return axios.put(`${API_BASE_URL}/update-medicine`, inputData);
};

export {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getMedicineById
};