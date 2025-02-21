import React, { Component } from "react";
import { connect } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../../store/actions/cartActions";
import "./Cart.scss";
import { getCartByUserId } from "../../services/cartService";
import { getMedicineById } from "../../services/productService";
import { withRouter } from "react-router-dom";

class Cart extends Component {
  state = {
    cartData: JSON.parse(localStorage.getItem("cartData")) || [],
    selectedItems: [],
    selectAll: false,
  };

  componentDidMount() {
    if (!this.state.cartData.length) {
      this.fetchCartData();
    }
  }

  // Fetch cart data from API
  fetchCartData = async () => {
    try {
      const { userInfo } = this.props;
      const userId = userInfo?.id;
      const response = await getCartByUserId(userId);
      const cartItems = response.cartItems;

      const updatedCartItems = await Promise.all(
        cartItems.map(async (item) => {
          const medicineResponse = await getMedicineById(item.medicineId);
          return {
            ...item,
            name: medicineResponse.data.name,
            description: medicineResponse.data.description,
            image: medicineResponse.data.image || "/images/default.png",
          };
        })
      );

      this.setState({ cartData: updatedCartItems });
      localStorage.setItem("cartData", JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // Remove item from cart
  handleRemoveFromCart = (productId) => {
    this.props.removeFromCart(productId);
    const updatedCart = this.state.cartData.filter((item) => item.id !== productId);
    this.setState({ cartData: updatedCart });
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  // Update quantity of item
  handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      this.props.updateCartQuantity(productId, quantity);
      const updatedCartData = this.state.cartData.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      this.setState({ cartData: updatedCartData });
      localStorage.setItem("cartData", JSON.stringify(updatedCartData));
    }
  };

  // Select individual item
  handleSelectItem = (productId) => {
    const { selectedItems } = this.state;
    const updatedSelection = selectedItems.includes(productId)
      ? selectedItems.filter((id) => id !== productId)
      : [...selectedItems, productId];

    this.setState({ selectedItems: updatedSelection });
  };

  // Select all items
  handleSelectAll = () => {
    const { selectAll, cartData } = this.state;
    if (selectAll) {
      this.setState({ selectedItems: [], selectAll: false });
    } else {
      const allProductIds = cartData.map((item) => item.id);
      this.setState({ selectedItems: allProductIds, selectAll: true });
    }
  };

  // Proceed to order page with selected items
  handleOrder = () => {
    const selectedProducts = this.state.cartData.filter((item) =>
      this.state.selectedItems.includes(item.id)
    );
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    this.props.history.push("/order", { selectedProducts });
  };

  // Back to home or product page
  handleBackToHome = () => {
    this.props.history.push("/home");
  };

  render() {
    const { cartData, selectedItems, selectAll } = this.state;

    return (
      <div className="cart-container">
        <h2 className="cart-title">🛒 Giỏ hàng của bạn</h2>

        {cartData.length === 0 ? (
          <p className="empty-cart">Giỏ hàng trống.</p>
        ) : (
          <>
            <div className="cart-header">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={this.handleSelectAll}
              />
              <span>Chọn tất cả</span>
            </div>

            <div className="cart-items">
              {cartData.map((item) => (
                <div className="cart-item" key={item.id}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => this.handleSelectItem(item.id)}
                  />

                  <img src={item.image} alt={item.name} className="cart-item-image" />

                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-description">{item.description}</p>
                  </div>

                  <p className="cart-item-price">{item.price.toLocaleString()} $</p>

                  <div className="cart-item-quantity">
                    <button onClick={() => this.handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => this.handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => this.handleRemoveFromCart(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <button className="back-buttons" onClick={this.handleBackToHome}>
                🔙 Quay lại
              </button>
              <button className="order-button" onClick={this.handleOrder}>
                🛒 Đặt hàng
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart.Carts,
  userInfo: state.user.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  removeFromCart: (productId) => dispatch(removeFromCart(productId)),
  updateCartQuantity: (productId, quantity) => dispatch(updateCartQuantity(productId, quantity)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cart));
