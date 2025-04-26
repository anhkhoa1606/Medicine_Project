import { toast } from "react-toastify";
import {
  createOrderService,
  deleteOrderService,
  editOrderService,
  getOrderService,
} from "../../services/orderService";

import {
    addToCartService,
    checkCart,
    deleteCart,
    getCartByUserId
  } from "../../services/cartService";

import actionTypes from "./actionTypes";
import { getMedicineById } from "../../services/productService";

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
            const res = await addToCartService(userId, product, quantity);

            if (res.errCode == 0) {
                dispatch({
                    type: actionTypes.ADD_TO_CART,
                    payload: product,
                });
            } else {
                console.error("Failed to update cart:", res.message);
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };
};

export const fetchCart = (userId) => async (dispatch) => {
  try {
    // Gọi API lấy giỏ hàng
    const response = await getCartByUserId(userId);
    const cartItems = response.cartItems || []; // Đảm bảo không bị lỗi nếu API trả về undefined

    // Gửi yêu cầu lấy thông tin thuốc từ medicineId
    const medicineRequests = cartItems.map((item) =>
      getMedicineById(item.medicineId)
    );

    const medicineResponses = await Promise.all(medicineRequests);

    // Gắn thông tin thuốc vào từng item trong giỏ hàng
    const updatedCartItems = cartItems.map((item, index) => ({
      ...item,
      ...medicineResponses[index].data, // Merge dữ liệu từ API thuốc
    }));

    // Dispatch dữ liệu đã cập nhật vào Redux store
    dispatch({
      type: actionTypes.FETCH_CART,
      payload: updatedCartItems,
    });
  } catch (error) {
    console.error("Error fetching cart", error);
  }
};


export const removeFromCart = (id) => async (dispatch) => {
  try {
    const response = await deleteCart(id);

    dispatch({
      type: actionTypes.REMOVE_CART,
      payload: response.data,
    });
  } catch (error) {
    console.error("Error removing item from cart", error);
  }
};

export const checkCartAction = (userId, medicineId) => async (dispatch) => {
  try {
      // Gọi API check giỏ hàng
      const response = await checkCart(userId, medicineId);

      if (response.exists) {
          // Nếu sản phẩm đã có trong giỏ hàng
          dispatch({
              type: actionTypes.CART_ITEM_ALREADY_EXISTS,
              payload: { medicineId, message: response.message }
          });
      } else {
          // Nếu sản phẩm chưa có trong giỏ hàng
          dispatch({
              type: actionTypes.CART_ITEM_NOT_FOUND,
              payload: { medicineId, message: response.message, cartId: response.cartId }
          });
      }

      return response; 

  } catch (error) {
      console.error("Lỗi khi kiểm tra giỏ hàng:", error);
      dispatch({
          type: actionTypes.CHECK_CART_ERROR,
          payload: { error: error.message }
      });
      throw error; // ✅ Trả lỗi để bắt lỗi ở component
  }
};


export const updateCartQuantity = (productId, quantity) => {
    return {
        type: actionTypes.UPDATE_CART_QUANTITY,
        payload: { productId, quantity },
    };
};