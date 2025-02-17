import axios from "../axios";

const getAllProducts = () => {
  return axios.get(`/get-all-medicines`);
};
const createProduct = (data) => {
  return axios.post("/create-product", data);
};
const deleteProduct = (userId) => {
  return axios.delete("/delete-medicine", {
    data: {
      id: userId,
    },
  });
};
const updateProduct = (inputData) => {
  return axios.put("/update-medicine", inputData);
};

export {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};