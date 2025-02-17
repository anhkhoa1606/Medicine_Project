import { toast } from "react-toastify";
import {
  createOrderService,
  deleteOrderService,
  editOrderService,
  getOrderService,
} from "../../services/orderService";

import {
    addToCartService,
    getCartByUserId
  } from "../../services/cartService";

import actionTypes from "./actionTypes";

export const createOrder = (data) => {
  return async (dispatch, getState) => {
    let res = await createOrderService(data);
    if (res && res.errCode === 0) {
      dispatch(createOrderSuccess(res));
      toast.success(`Order successful!`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };
};

export const createOrderSuccess = (data) => ({
  type: actionTypes.CREATE_ORDER,
  data: data,
});

export const getOrder = () => {
  return async (dispatch, getState) => {
    let res = await getOrderService();
    console.log(res.order);
    if (res && res.errCode === 0) {
      dispatch(getOrderSuccess(res.order));
    }
  };
};

export const getOrderSuccess = (data) => ({
  type: actionTypes.GET_ORDER,
  data: data,
});

export const editOrder = (data) => {
  return async (dispatch, getState) => {
    let res = await editOrderService(data);
    if (res && res.errCode === 0) {
      return {
        type: actionTypes.EDIT_ORDER,
        data: data,
      };
    }
  };
};

export const deleteOrder = (orderCode) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteOrderService(orderCode);
      if (res && res.errCode === 0) {
        toast.success(`Delete order successful!`, {
          position: "bottom-right",
          autoClose: 3000,
        });
        dispatch(getOrder());
        return {
          type: actionTypes.DELETE_ORDER,
        };
      } else {
        toast.error("Delete order failed!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (e) {
      toast.error(e, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };
};

// Payment

export const storeOrderData = (orderData) => ({
  type: actionTypes.STORE_ORDER_DATA,
  payload: orderData,
});

export const clearCart = () => ({
  type: actionTypes.CLEAR_CART,
});

export const clearOrder = () => ({
  type: actionTypes.CLEAR_ORDER,
});

export const coursePurchased = () => {
  return {
    type: actionTypes.COURSE_PURCHASED,
  };
};

export const addToCart = (userId, product, quantity = 1) => {
    return async (dispatch, getState) => {
        try {
            console.log("Adding product to cart:", product.id, userId, quantity);

            const res = await addToCartService(userId, product.id, quantity);
            console.log('res', res);
            if (res.data.success) {
                dispatch({
                    type: actionTypes.ADD_TO_CART,
                    payload: product,
                });

                console.log("Cart updated successfully on server.");
            } else {
                console.error("Failed to update cart:", res.data.message);
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };
};

// export const fetchCart = (userId) => async (dispatch) => {
//     try {
//         console.log("Fetching cart for userId:", userId);
//         const response = await getCartByUserId(userId);
//         console.log("Cart API response:", response.cartItems);

//         dispatch({
//             type: "SET_CART_ITEMS",
//             payload: response.cartItems, // Đảm bảo dùng `response.data.cartItems`
//         });
//     } catch (error) {
//         console.error("Error fetching cart", error);
//     }
// };

export const removeFromCart = (productId) => {
    return {
        type: actionTypes.DELETE_CART,
        payload: productId,
    };
};
export const updateCartQuantity = (productId, quantity) => {
    return {
        type: actionTypes.UPDATE_CART_QUANTITY,
        payload: { productId, quantity },
    };
};