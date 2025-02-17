import cartService from "../services/cartService";

// let addToCart = async (req, res) => {
//     try {
//         let { userId, productId, quantity } = req.body;
//         if (!userId || !productId || !quantity) {
//             return res.status(400).json({ errCode: 1, message: "Missing required fields" });
//         }

//         let response = await cartService.addToCart(userId, productId, quantity);
//         return res.status(200).json(response);
//     } catch (error) {
//         console.error("Error in addToCart:", error);
//         return res.status(500).json({ errCode: -1, message: "Error from server" });
//     }
// };

let addToCart = async (req, res) => {
    try {
        let response = await cartService.addToCart(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

let getCartByUserId = async (req, res) => {
    try {
        let { userId } = req.params;
        console.log("userId: " + userId);
        if (!userId) {
            return res.status(400).json({ errCode: 1, message: "User ID is required" });
        }

        let response = await cartService.getCartByUserId(userId);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in getCartByUserId:", error);
        return res.status(500).json({ errCode: -1, message: "Error from server" });
    }
};

export default {
    addToCart,
    getCartByUserId
};
