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
      let infor = await medicineService.getProductById(req.query.id);
      return res.status(200).json(infor);
    } catch (e) {
      console.log(e);
      return res.status(200).json({
        errCode: -1,
        errMessage: "Error from server...",
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
    let data = req.body;
    let message = await medicineService.updateProduct(data);
    return res.status(200).json(message);
};

let deleteProduct = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter",
        });
    }
    let message = await medicineService.deleteProduct(req.body.id);
    return res.status(200).json(message);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};