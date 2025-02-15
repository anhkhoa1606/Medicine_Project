'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Medicine extends Model {
        static associate(models) {
        }
    };
    Medicine.init({
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        price: DataTypes.STRING,
        stock: DataTypes.STRING,
        category: DataTypes.STRING,
        image: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Medicine',
    });
    return Medicine;
};