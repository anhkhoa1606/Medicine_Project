import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCart, removeFromCart, updateCartQuantity } from "../../store/actions/cartActions";
import "./Cart.scss";
import { withRouter } from "react-router-dom";

class Cart extends Component {
  state = {
    selectedItems: [],
    selectAll: false,
  };

  componentDidMount() {
    const { userInfo, fetchCart } = this.props;
    if (userInfo?.id) {
      fetchCart(userInfo.id);
    }
  }

  // Remove item from cart and refresh the cart
  handleRemoveFromCart = async (productId) => {
    await this.props.removeFromCart(productId);
    this.props.fetchCart(this.props.userInfo.id); // Load lại giỏ hàng sau khi xóa
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
    const { selectAll } = this.state;
    const { cart } = this.props;

    if (selectAll) {
      this.setState({ selectedItems: [], selectAll: false });
    } else {
      const allProductIds = cart.map((item) => item.id);
      this.setState({ selectedItems: allProductIds, selectAll: true });
    }
  };

  // Proceed to order page with selected items
  handleOrder = () => {
    const { cart } = this.props;
    const selectedProducts = cart.filter((item) =>
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
    const { cart } = this.props;
    console.log('cart', cart)
    const { selectedItems, selectAll } = this.state;

    return (
      <div className="cart-container">
        <h2 className="cart-title">🛒 Giỏ hàng của bạn</h2>

        {cart.length === 0 ? (
          <>
            <p className="empty-cart">Giỏ hàng trống.</p>
            <button className="back-buttons" onClick={this.handleBackToHome}>
              🔙 Quay lại
            </button>
          </>
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
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => this.handleSelectItem(item.id)}
                  />

                  <img src={item.data.image} alt={item.data.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.data.name}</h3>
                    <p className="cart-item-description">{item.data.description}</p>
                  </div>
                  <p className="cart-item-price">{item.price.toLocaleString()} $</p>
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
  cart: state.cart.Carts, // Lấy giỏ hàng từ Redux store
  userInfo: state.user.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCart: (userId) => dispatch(fetchCart(userId)), // Action lấy giỏ hàng
  removeFromCart: (productId) => dispatch(removeFromCart(productId)), // Action xóa sản phẩm khỏi giỏ hàng
  updateCartQuantity: (productId, quantity) => dispatch(updateCartQuantity(productId, quantity)), // Action cập nhật số lượng sản phẩm
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cart));
