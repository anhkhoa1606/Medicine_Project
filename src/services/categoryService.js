import db from '../models/index';

let getAllCategories = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let categories = await db.Category.findAll();
            resolve({
                errCode: 0,
                message: "Success",
                data: categories
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getCategoryById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let category = await db.Category.findOne({ where: { id: id } });
            if (category) {
                resolve({
                    errCode: 0,
                    message: "Success",
                    data: category
                });
            } else {
                resolve({
                    errCode: 2,
                    message: "Category not found"
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let createCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name) {
                resolve({
                    errCode: 1,
                    message: "Missing required fields!"
                });
            }

            let newCategory = await db.Category.create({
                name: data.name,
                description: data.description || '',
            });

            resolve({
                errCode: 0,
                message: "Category created successfully",
                data: newCategory
            });
        } catch (e) {
            reject(e);
        }
    });
};

let updateCategory = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    message: "Missing required parameters!"
                });
            }

            let category = await db.Category.findOne({
                where: { id: data.id },
            });

            if (category) {
                category.name = data.name;
                category.description = data.description;

                await category.save();
                resolve({
                    errCode: 0,
                    message: "Category has been updated successfully",
                });
            } else {
                resolve({
                    errCode: 1,
                    message: "Category not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteCategory = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let category = await db.Category.findOne({ where: { id: id } });

            if (!category) {
                resolve({
                    errCode: 2,
                    message: "Category not found"
                });
            }

            await db.Category.destroy({ where: { id: id } });

            resolve({
                errCode: 0,
                message: "Category deleted successfully"
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
