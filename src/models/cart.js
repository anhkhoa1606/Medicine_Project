'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Một giỏ hàng thuộc về một người dùng
      Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

      // Một giỏ hàng có nhiều CartItem
      Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' });
    }
  };

  Cart.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: 'Cart',
    }
  );

  return Cart;
};
