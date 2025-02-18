import axios from "../axios";

const createOrderService = (data) => {
  return axios.post("/create-order", data);
};
const getOrderService = () => {
  return axios.get(`/get-order`);
};
const getOderByUserService = () => {
  return axios.get(`/get-order-by-user`);
};
const getDetailOrderById = (id) => {
  return axios.get(`/get-orders-by-id?id=${id}`);
};
const editOrderService = (data) => {
  return axios.put("/edit-order", data);
};
const findOrdersByName = (name) => {
  return axios.get(`/find-orders-by-name?name=${name}`);
};
const deleteOrderService = (inputId) => {
  return axios.delete("/delete-order", { data: { id: inputId } });
};
export {
  createOrderService,
  getOrderService,
  editOrderService,
  deleteOrderService,
  getOderByUserService,
  findOrdersByName,
  getDetailOrderById,
};