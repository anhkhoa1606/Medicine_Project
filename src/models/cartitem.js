'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      // Một CartItem thuộc về một giỏ hàng
      CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });

      // Một CartItem thuộc về một sản phẩm (Medicine)
      CartItem.belongsTo(models.Medicine, { foreignKey: 'medicineId', as: 'medicine' });
    }
  };

  CartItem.init(
    {
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'Carts',
        //   key: 'id',
        // },
      },
      medicineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'Medicines',
        //   key: 'id',
        // },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CartItem',
    }
  );

  return CartItem;
};
