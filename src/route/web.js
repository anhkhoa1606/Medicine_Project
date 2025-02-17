import express from "express";
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import cartController from '../controllers/cartController';
import medicineController from '../controllers/medicineController';
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    
    //Users
    router.post('/api/login', userController.handleLoging);
    router.get('/get-all-users', userController.handleGetAllUsers);
    router.get('/get-user-by-id', userController.handleGetUserById);
    router.post('/create-user', userController.handleCreateUser);
    router.put('/update-user', userController.handleUpdateUser);
    router.delete('/delete-user', userController.handleDeleteUser);

    //Medicine
    router.get('/get-all-medicines', medicineController.getAllProducts);
    router.get('/get-medicines-by-id', medicineController.getProductById);
    router.post('/create-product', medicineController.createProduct);
    router.put('/update-medicine', medicineController.updateProduct);
    router.delete('/delete-medicine', medicineController.deleteProduct);

    //Payment
    router.get("/payment/config", (req, res) => {
        return res.status(200).json({
          status: "success",
          data: process.env.CLIENT_ID,
        });
    });

    //Cart
    router.post("/add-to-cart", cartController.addToCart);

    router.get("/get-cart/:userId", cartController.getCartByUserId);
    
    

    return app.use("/", router);
}

module.exports = initWebRoutes;