import db from '../models/index';

const addToCart = async (data) => {
  try {
    const { userId, medicineId, quantity } = data;
    console.log('data', data);

    if (!userId || !medicineId || !quantity) {
      return {
        errCode: 1,
        message: "Missing required fields!"
      };
    }

    let cart = await db.Cart.findOne({ where: { userId, status: "active" } });

    if (!cart) {
      cart = await db.Cart.create({ userId, status: "active" });
    }

    let cartItem = await db.CartItem.findOne({ where: { cartId: cart.id, medicineId } });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await db.CartItem.create({ cartId: cart.id, medicineId, quantity, price: 100 });
    }

    return {
      errCode: 0,
      message: "Product added to cart",
      cartItem
    };

  } catch (error) {
    console.error("Error in addToCart:", error);
    return {
      errCode: 500,
      message: "Server error"
    };
  }
};


let getCartByUserId = async (userId) => {
  try {
    let cart = await db.Cart.findOne({
      where: { userId, status: "active" },
      include: [{ model: db.CartItem, as: "items" }],
    });
    console.log('cart', cart);

    if (!cart) return { cartItems: [] };

    return { cartItems: cart.items };
  } catch (error) {
    throw new Error("Server error");
  }
};
module.exports = { addToCart, getCartByUserId };
