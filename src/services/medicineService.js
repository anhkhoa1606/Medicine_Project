import db from '../models/index';
import fs from "fs";

let getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = await db.Medicine.findAll();
            resolve({
                errCode: 0,
                message: "Success",
                data: products
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getProductById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await db.Medicine.findOne({ where: { id: id } });
            if (product) {
                resolve({
                    errCode: 0,
                    message: "Success",
                    data: product
                });
            } else {
                resolve({
                    errCode: 2,
                    message: "Product not found"
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let createProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem các trường bắt buộc có bị thiếu không
            if (!data.name || !data.price || !data.stock || !data.categoryId) {
                return resolve({
                    errCode: 1,
                    message: "Missing required fields! (name, price, stock, categoryId)"
                });
            }

            // Kiểm tra xem categoryId có tồn tại không
            let categoryExists = await db.Category.findOne({ where: { id: data.categoryId } });
            if (!categoryExists) {
                return resolve({
                    errCode: 2,
                    message: "Category not found"
                });
            }

            // Tạo sản phẩm mới
            let newProduct = await db.Medicine.create({
                name: data.name,
                description: data.description || '',
                price: data.price,
                stock: data.stock,
                categoryId: data.categoryId,  // Dùng categoryId thay vì category
                image: data.image,
            });

            resolve({
                errCode: 0,
                message: "Product created successfully",
                data: newProduct
            });
        } catch (e) {
            reject(e);
        }
    });
};

let updateProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.categoryId) {
                return resolve({
                    errCode: 1,
                    message: "Missing required parameters! (id, categoryId)"
                });
            }

            let medicine = await db.Medicine.findOne({
                where: { id: data.id },
            });

            if (!medicine) {
                return resolve({
                    errCode: 2,
                    message: "Medicine not found"
                });
            }

            // Kiểm tra xem categoryId có tồn tại không
            let categoryExists = await db.Category.findOne({ where: { id: data.categoryId } });
            if (!categoryExists) {
                return resolve({
                    errCode: 3,
                    message: "Category not found"
                });
            }

            // Cập nhật thông tin sản phẩm
            medicine.name = data.name;
            medicine.description = data.description;
            medicine.price = data.price;
            medicine.stock = data.stock;
            medicine.categoryId = data.categoryId;  // Cập nhật categoryId thay vì category
            medicine.image = data.image;

            await medicine.save();

            resolve({
                errCode: 0,
                message: "The medicine has been updated successfully",
            });
        } catch (e) {
            reject(e);
        }
    });
};


let deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await db.Medicine.findOne({ where: { id: id } });

            if (!product) {
                resolve({
                    errCode: 2,
                    message: "Product not found"
                });
            }

            await db.Medicine.destroy({ where: { id: id } });

            resolve({
                errCode: 0,
                message: "Product deleted successfully"
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};