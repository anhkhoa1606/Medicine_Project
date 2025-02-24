'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Medicine extends Model {
        static associate(models) {
            Medicine.hasMany(models.CartItem, { foreignKey: 'medicineId', as: 'items' });
            Medicine.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
        }
    };
    Medicine.init({
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        price: DataTypes.STRING,
        stock: DataTypes.STRING,
        image: DataTypes.STRING,
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Categories',
                key: 'id'
            },
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Medicine',
    });
    return Medicine;
};