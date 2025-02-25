import orderService from "../services/orderService";

let createOrder = async (req, res) => {
  let message = await orderService.createOrderService(req.body);
  return res.status(200).json(message);
};

let getOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    let order = await orderService.getOrderService(userId);
    return res.status(200).json(order);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let getOderByUserService = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    let orders = await orderService.getOrderByUserService(userId);

    const filteredOrders = orders.filter((order) => order.userId === userId);

    return res.status(200).json(filteredOrders);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let editOrder = async (req, res) => {
  let data = req.body;
  let message = await orderService.editOrderService(data);
  return res.status(200).json(message);
};

let deleteOrder = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await orderService.deleteOrderService(req.body.id);
  return res.status(200).json(message);
};
let filterOrdersByName = async (req, res) => {
  try {
    let infor = await orderService.filterOrdersByName(req.query.name);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let getDetailOrderById = async (req, res) => {
  try {
    let infor = await orderService.getDetailOrderById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};
module.exports = {
  createOrder: createOrder,
  getOrder: getOrder,
  editOrder: editOrder,
  deleteOrder: deleteOrder,
  getOderByUserService: getOderByUserService,
  filterOrdersByName: filterOrdersByName,
  getDetailOrderById: getDetailOrderById,
};