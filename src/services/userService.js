import axios from "../axios";

//User
const handleLoginApi = (email, password) => {
  return axios.post("api/login", { email, password });
};
const getAllUsers = () => {
  return axios.get(`/get-all-users`);
};
const createNewUserServices = (data) => {
  return axios.post("/create-user", data);
};
const createRegisterUserServices = (data) => {
  return axios.post("api/registerNewUser", data);
};
const changeUserPassword = (data) => {
  return axios.post("/api/change-password", data);
};
const forgotPassword = (data) => {
  return axios.post("/api/forgot-password", data);
};
const deleteUserServices = (userId) => {
  return axios.delete("/delete-user", {
    data: {
      id: userId,
    },
  });
};
const editUserServices = (inputData) => {
  return axios.put("/update-user", inputData);
};

const getUserById = (id) => {
  return axios.get(`/get-user-by-id`, { params: { id } });
};

export {
  handleLoginApi,
  getUserById,
  getAllUsers,
  createNewUserServices,
  createRegisterUserServices,
  deleteUserServices,
  editUserServices,
  changeUserPassword,
  forgotPassword,
};