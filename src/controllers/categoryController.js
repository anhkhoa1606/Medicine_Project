import categoryService from '../services/categoryService';

let getAllCategories = async (req, res) => {
    try {
        let response = await categoryService.getAllCategories();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

let getCategoryById = async (req, res) => {
    try {
        let infor = await categoryService.getCategoryById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server...",
        });
    }
};

let createCategory = async (req, res) => {
    try {
        let response = await categoryService.createCategory(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

let updateCategory = async (req, res) => {
    try {
        let data = req.body;
        let message = await categoryService.updateCategory(data);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

let deleteCategory = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing required parameter: id",
            });
        }
        let message = await categoryService.deleteCategory(req.body.id);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
