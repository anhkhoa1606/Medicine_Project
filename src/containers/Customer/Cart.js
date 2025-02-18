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
    selectedItems: [], // Lưu các sản phẩm đã chọn
    selectAll: false, // Chọn tất cả
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
          name: medicineResponse.name,
          description: medicineResponse.description,
        };
      }));

      this.setState({ cartData: updatedCartItems });
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

  // Thêm hoặc bớt sản phẩm vào danh sách chọn
  handleSelectItem = (productId) => {
    const { selectedItems } = this.state;
    if (selectedItems.includes(productId)) {
      this.setState({ selectedItems: selectedItems.filter(item => item !== productId) });
    } else {
      this.setState({ selectedItems: [...selectedItems, productId] });
    }
  };

  // Chọn hoặc bỏ chọn tất cả sản phẩm
  handleSelectAll = () => {
    if (this.state.selectAll) {
      this.setState({ selectedItems: [], selectAll: false });
    } else {
      const allProductIds = this.state.cartData.map(item => item.id);
      this.setState({ selectedItems: allProductIds, selectAll: true });
    }
  };

  handleOrder = () => {
    // Lấy các sản phẩm đã chọn và gửi tới backend để tạo đơn hàng
    const selectedProducts = this.state.cartData.filter(item => this.state.selectedItems.includes(item.id));
    console.log("Selected products:", selectedProducts);
    this.props.history.push("/order", { selectedProducts });
    // Bạn có thể gửi dữ liệu selectedProducts vào backend để tạo order.
    // Sau khi tạo đơn hàng, bạn có thể chuyển hướng người dùng đến trang thanh toán
  };

  render() {
    const { cartData, selectedItems, selectAll } = this.state;

    return (
      <div className="cart-container">
        <h2 className="cart-title">Giỏ hàng của bạn</h2>
        {cartData.length === 0 ? (
          <p className="empty-cart">Giỏ hàng trống</p>
        ) : (
          <>
            <div>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={this.handleSelectAll}
              />{" "}
              Chọn tất cả
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

            <button className="order-button" onClick={this.handleOrder}>
              Đặt hàng
            </button>
          </>
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
    removeFromCart: (productId) => dispatch(removeFromCart(productId)),
    updateCartQuantity: (productId, quantity) => dispatch(updateCartQuantity(productId, quantity)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cart));
