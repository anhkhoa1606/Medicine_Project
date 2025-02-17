"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      username: DataTypes.STRING,
      totalPrice: DataTypes.FLOAT,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.INTEGER,
      payment: DataTypes.STRING,
      medicine: DataTypes.STRING,
    },
    { 
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};