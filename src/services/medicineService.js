import db from '../models/index';
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

import fs from "fs";

let encodeImageToBase64 = (imagePath) => {
    try {
        let imageBuffer = fs.readFileSync(imagePath);
        return imageBuffer.toString("base64");
    } catch (error) {
        console.error("Error reading image file:", error);
        return "";
    }
};

let createProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let base64Image = data.image ? encodeImageToBase64(data.image) : "";
            if (!data.name || !data.price || !data.stock || !data.category) {
                resolve({
                    errCode: 1,
                    message: "Missing required fields!"
                });
            }

            let newProduct = await db.Medicine.create({
                name: data.name,
                description: data.description || '',
                price: data.price,
                stock: data.stock,
                category: data.category,
                image: base64Image,
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


let updateProduct = async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!data.id) {
          resolve({
            errCode: 2,
            errMessage: "Missing required parameters!",
          });
        }
        console.log(data)
        let medicine = await db.Medicine.findOne({
          where: { id: data.id },
        });
        if (medicine) {
          (medicine.id = data.id),
            (medicine.name = data.name),
          (medicine.description = data.description),
            (medicine.price = data.price),
            (medicine.stock = data.stock),
            (medicine.category = data.category),
            (medicine.image = data.image);
          await medicine.save();
          resolve({
            errCode: 0,
            message: "The medicine has been updated successfully",
          });
        } else {
          resolve({
            errCode: 1,
            message: "Medicine not found",
          });
        }
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