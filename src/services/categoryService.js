import axios from "../axios";

const getAllCategories = () => {
  return axios.get(`/get-all-categories`);
};

const getCategoryById = (id) => {
  return axios.get(`/get-category-by-id`, { params: { id } });
};

const createCategory = (data) => {
  return axios.post("/create-category", data);
};
const deleteCategory = (userId) => {
  return axios.delete("/delete-category", {
    data: {
      id: userId,
    },
  });
};
const updateCategory = (inputData) => {
  return axios.put("/update-category", inputData);
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
  updateCategory
};