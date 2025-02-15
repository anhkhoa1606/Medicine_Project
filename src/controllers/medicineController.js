import medicineService from '../services/medicineService';

let getAllProducts = async (req, res) => {
    try {
        let response = await medicineService.getAllProducts();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

let getProductById = async (req, res) => {
    try {
        let productId = req.params.id;
        let response = await medicineService.getProductById(productId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

let createProduct = async (req, res) => {
    try {
        let response = await medicineService.createProduct(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

let updateProduct = async (req, res) => {
    try {
        let productId = req.params.id;
        let response = await medicineService.updateProduct(productId, req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

let deleteProduct = async (req, res) => {
    try {
        let productId = req.params.id;
        let response = await medicineService.deleteProduct(productId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};