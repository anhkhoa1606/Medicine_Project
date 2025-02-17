import actionTypes from "../actions/actionTypes";

const initialState = {
  numberCart: 0,
  Carts: [],
  urlPayment: {},
  order: [],
  items: [],
  orders: [],
  orderData: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART: {
      const existingProductIndex = state.Carts.findIndex(
        (item) => item.id === action.payload.id
      );

      let updatedCarts;
      if (existingProductIndex !== -1) {
        updatedCarts = state.Carts.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCarts = [...state.Carts, { ...action.payload, quantity: 1 }];
      }

      return {
        ...state,
        Carts: updatedCarts, // Cập nhật vào Carts
      };
    }
    case actionTypes.GET_ORDER:
      return {
        ...state,
        order: action.data,
      };
    case actionTypes.GET_NUMBER_CART:
      return {
        ...state,
      };
    case actionTypes.UPDATE_CART_QUANTITY:
      return {
        ...state,
        Carts: state.Carts.map((item) =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case actionTypes.DELETE_CART:
      return {
        ...state,
        Carts: state.Carts.filter((item) => item.id !== action.payload),
      };

    case actionTypes.CREATE_PAYMENT:
      state.urlPayment = action.data;
      console.log("state.urlPayment", state.urlPayment);
      return {
        ...state,
      };
    case actionTypes.SET_CART_ITEMS:
      return {
        ...state,
        Carts: action.payload,
      };
    case actionTypes.DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.payload.id),
      };
    case actionTypes.STORE_ORDER_DATA:
      return {
        ...state,
        orderData: action.payload,
      };

    case actionTypes.CLEAR_CART:
      return initialState;
    // Handle other actions...
    case actionTypes.CLEAR_ORDER:
      return initialState;
    // Handle other actions...
    case actionTypes.COURSE_PURCHASED:
      return {
        ...state,
        coursePurchased: true,
      };
    default:
      return state;
  }
};

export default cartReducer;
