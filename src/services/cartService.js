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

const deleteCartService = async (id) => {
  try {
    const item = await db.CartItem.findOne({ where: { id } });
    console.log('first', item, id);
    if (!item) {
      return { success: false, message: 'Item not found in cart' };
    }

    await item.destroy();
    return { success: true, message: 'Item deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkCartItemService = async (userId, medicineId) => {
  if (!userId || !medicineId) {
      throw new Error("Thiếu userId hoặc medicineId");
  }

  try {
      // 1️⃣ Tìm giỏ hàng 'active' của user
      const activeCart = await db.Cart.findOne({
          where: { userId, status: 'active' }
      });

      if (!activeCart) {
          return { exists: false, message: "Không tìm thấy giỏ hàng hoạt động!" };
      }

      // 2️⃣ Kiểm tra trong `CartItem` xem có `medicineId` trong `cartId` chưa
      const existingItem = await db.CartItem.findOne({
          where: { cartId: activeCart.id, medicineId }
      });

      return existingItem
          ? { exists: true, message: "Sản phẩm đã có trong giỏ hàng!" }
          : { exists: false, message: "Sản phẩm chưa có trong giỏ hàng!", cartId: activeCart.id };

  } catch (error) {
      throw new Error(error.message);
  }
};


module.exports = { addToCart, getCartByUserId, deleteCartService, checkCartItemService };
