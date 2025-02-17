import axios from "../axios";

const addToCartService = (userId, medicineId, quantity) => {
    return axios.post(`/add-to-cart`, {
      userId,
      medicineId,
      quantity,
    });
  };

const getCartByUserId = (userId) => {
    return axios.get(`/get-cart/${userId}`);
};

export {
    addToCartService,
    getCartByUserId
};