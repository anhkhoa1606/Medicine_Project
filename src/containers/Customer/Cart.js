import React, { Component } from "react";
import { connect } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../../store/actions/cartActions";
import "./Cart.scss";
import { getCartByUserId } from "../../services/cartService";
import { getMedicineById } from "../../services/productService";
import { withRouter } from "react-router-dom";

class Cart extends Component {
  state = {
    cartData: [],
    selectedItems: [],
    selectAll: false,
  };

  componentDidMount() {
    this.fetchCartData();
  }

  fetchCartData = async () => {
    try {
      let { userInfo } = this.props;
      let userId = userInfo?.id;
      let response = await getCartByUserId(userId);
      let cartItems = response.cartItems;

      const updatedCartItems = await Promise.all(cartItems.map(async (item) => {
        const medicineResponse = await getMedicineById(item.medicineId);
        return {
          ...item,
          name: medicineResponse.data.name,
          description: medicineResponse.data.description,
          image: medicineResponse.data.image || "/images/default.png",
        };
      }));

      this.setState({ cartData: updatedCartItems });
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  handleRemoveFromCart = (productId) => {
    this.props.removeFromCart(productId);
    this.setState({
      cartData: this.state.cartData.filter(item => item.id !== productId)
    });
  };

  handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      this.props.updateCartQuantity(productId, quantity);
      const updatedCartData = this.state.cartData.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      this.setState({ cartData: updatedCartData });
    }
  };

  handleSelectItem = (productId) => {
    const { selectedItems } = this.state;
    this.setState({
      selectedItems: selectedItems.includes(productId)
        ? selectedItems.filter(id => id !== productId)
        : [...selectedItems, productId]
    });
  };

  handleSelectAll = () => {
    const { selectAll, cartData } = this.state;
    if (selectAll) {
      this.setState({ selectedItems: [], selectAll: false });
    } else {
      const allProductIds = cartData.map(item => item.id);
      this.setState({ selectedItems: allProductIds, selectAll: true });
    }
  };

  handleOrder = () => {
    const selectedProducts = this.state.cartData.filter(item =>
      this.state.selectedItems.includes(item.id)
    );
    console.log("Selected products:", selectedProducts);
    this.props.history.push("/order", { selectedProducts });
  };
  handleBackToCart = () => {
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
              <button className="back-buttons" onClick={this.handleBackToCart}>
                🔙 Quay lại giỏ hàng
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
