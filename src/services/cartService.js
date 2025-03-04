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

const checkCart = (userId, medicineId) => {
  return axios.get(`check-cart`, {
    params: {
      userId: userId,
      medicineId: medicineId
    }
  });
};


const deleteCart = (id) => {
  return axios.delete(`/delete-cart`, {
    data: {
      id: id,
    },
  });
};



export {
    addToCartService,
    getCartByUserId,
    deleteCart,
    checkCart
};