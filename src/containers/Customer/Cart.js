import React, { Component } from "react";
import { connect } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../../store/actions/cartActions";
import "./Cart.scss";
import { getCartByUserId } from "../../services/cartService";
class Cart extends Component {
  state = {
    cartData: [],
  };

  componentDidMount() {
    this.fetchCartData();
  }
  fetchCartData = async () => {
    try {
      let { userInfo } = this.props;
      let userId = userInfo?.id;
      console.log("userId: " + userId);
      let response = await getCartByUserId(userId);
      console.log(response.cartItems);
      this.setState({ cartData: response.cartItems });
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };
  

  handleRemoveFromCart = (productId) => {
    this.props.removeFromCart(productId);
  };

  handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      this.props.updateCartQuantity(productId, quantity);
    }
  };

  render() {
    const { cartData } = this.state;
    console.log("cartData", cartData);

    return (
      <div className="cart-container">
        <h2 className="cart-title">Giỏ hàng của bạn</h2>
        {cartData.length === 0 ? (
          <p className="empty-cart">Giỏ hàng trống</p>
        ) : (
          <div className="cart-items">
            {cartData.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">{item.price.toLocaleString()}đ</p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.Carts,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // fetchCart: (userId) => dispatch(fetchCart(userId)),
    removeFromCart: (productId) => dispatch(removeFromCart(productId)),
    updateCartQuantity: (productId, quantity) => dispatch(updateCartQuantity(productId, quantity)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);