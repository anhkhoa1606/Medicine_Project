import db from "../models/index";
import { Op, fn, col, literal, Sequelize  } from "sequelize";

let createOrderService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let medicineList = Array.isArray(data.medicine) ? data.medicine : [data.medicine];

      let existingOrder = await db.Order.findOne({
        where: {
          userId: data.userId,
          medicine: {
            [Op.in]: medicineList,
          },
        },
      });
      if (existingOrder) {
        resolve({
          errCode: 1,
          errMessage: "Order already exists",
        });
      } else {
        await db.Order.create({
          userId: data.userId,
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber,
          payment: data.payment,
          medicine: JSON.stringify(data.medicine),
          totalPrice: data.totalPrice,
        });
        resolve({
          errCode: 0,
          errMessage: "oke",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getOrderService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = await db.Order.findAll();
      if (order) {
        resolve({
          errCode: 0,
          errMessage: "OK!",
          order,
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: "Get order failed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getOderByUserService = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (user) {
        let order = await db.Order.findOne({
          where: { userId: userId },
          raw: true,
          nest: true,
        });
        resolve(order);
      }
      resolve({
        errCode: 2,
        errMessage: "Get order failed!",
      });
    } catch (e) {
      reject(e);
      console.error(e);
    }
  });
};
let filterOrdersByName = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!name) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let data = await db.Orders.findAll({
          where: {
            name: {
              [Op.like]: "%" + name + "%",
            },
          },
          attributes: ["id", "username", "email"],
        });
        if (data) {
          resolve({
            errCode: 0,
            errMessage: "OK!",
            data,
          });
        } else {
          data = {};
          resolve({
            errCode: 1,
            errMessage: "Orders not found!",
            data,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let editOrderService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters!",
        });
      }
      let order = await db.Order.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (order) {
        order.id = data.id;
        order.userId = data.userId;
        order.username = data.username;
        order.totalPrice = data.totalPrice;
        order.phoneNumber = data.phoneNumber;
        order.email = data.email;
        await order.save();
        resolve({
          errCode: 0,
          errMessage: "Edit order successful!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Order not found!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteOrderService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    let order = await db.Order.findOne({
      where: { id: inputId },
    });
    if (!order) {
      resolve({
        errCode: 2,
        errMessage: "This order does not exist!",
      });
    }
    await db.Order.destroy({
      where: { id: inputId },
    });
    resolve({
      errCode: 0,
      errMessage: "Delete Order successful!",
    });
  });
};
let getDetailOrderById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let data = await db.Order.findOne({
          where: {
            id: inputId,
          },
          attributes: [
            "id",
            "username",
            "email",
            "phoneNumber",
            "payment",
            "totalPrice",
            "medicine",
          ],
        });
        if (data) {
          resolve({
            errCode: 0,
            errMessage: "OK!",
            data,
          });
        } else {
          data = {};
          resolve({
            errCode: 1,
            errMessage: "Order not found!",
            data,
          });
        }

        resolve({
          errCode: 0,
          errMessage: "OK!",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getRevenue = async () => {
  try {
    const orders = await db.Order.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("SUM", col("totalPrice")), "revenue"]
      ],
      where: {
        createdAt: {
          [Op.gte]: literal("DATE_SUB(CURDATE(), INTERVAL 6 DAY)"),
        },
      },
      group: ["date"],
      order: [["createdAt", "ASC"]],
      raw: true, // Giúp trả về dữ liệu dưới dạng object đơn giản
    });

    // Tính tổng doanh thu
    const totalRevenue = orders.reduce((acc, row) => acc + row.revenue, 0);

    // Tính phần trăm doanh thu từng ngày
    const result = orders.map(row => ({
      date: row.date,
      revenue: row.revenue,
      percentage: totalRevenue ? ((row.revenue / totalRevenue) * 100).toFixed(2) : 0
    }));

    return {
      errCode: 0,
      errMessage: "Success",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return {
      errCode: -1,
      errMessage: "Internal Server Error",
    };
  }
};




module.exports = {
  createOrderService: createOrderService,
  getOrderService: getOrderService,
  getOderByUserService: getOderByUserService,
  editOrderService: editOrderService,
  deleteOrderService: deleteOrderService,
  filterOrdersByName: filterOrdersByName,
  getDetailOrderById: getDetailOrderById,
  getRevenue: getRevenue
};