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
            if (!ObjectId.isValid(id)) {
                resolve({
                    errCode: 1,
                    message: "Invalid product ID"
                });
            }

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
                image: data.image || '',
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

let updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ObjectId.isValid(id)) {
                resolve({
                    errCode: 1,
                    message: "Invalid product ID"
                });
            }

            let product = await db.Medicine.findOne({ where: { id: id } });

            if (!product) {
                resolve({
                    errCode: 2,
                    message: "Product not found"
                });
            }

            await product.update({
                name: data.name || product.name,
                description: data.description || product.description,
                price: data.price || product.price,
                stock: data.stock || product.stock,
                category: data.category || product.category,
                image: data.image || product.image,
            });

            resolve({
                errCode: 0,
                message: "Product updated successfully",
                data: product
            });
        } catch (e) {
            reject(e);
        }
    });
};

let deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ObjectId.isValid(id)) {
                resolve({
                    errCode: 1,
                    message: "Invalid product ID"
                });
            }

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