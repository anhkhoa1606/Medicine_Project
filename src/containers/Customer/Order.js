import React, { Component } from "react";
import { connect } from "react-redux";
import "./Order.scss";
import { createOrderService } from "../../services/orderService";
import { getConfig } from "../../services/paymentService";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import { PayPalButton } from "react-paypal-button-v2";
import { removeFromCart, updateCartQuantity } from "../../store/actions/cartActions";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: localStorage.getItem("username") || "",
      email: localStorage.getItem("email") || "",
      phoneNumber: localStorage.getItem("phoneNumber") || "",
      payment: "PayPal",
      medicines: JSON.parse(localStorage.getItem("medicines")) || [],
      medicinePrice: localStorage.getItem("medicinePrice") || 0,
      sdkReady: false,
      showPaypal: false,
    };
  }

  async componentDidMount() {
    if (!window.paypal) {
      this.addPaypalScript();
    } else {
      this.setState({ sdkReady: true });
    }

    // Load selected products from location state or localStorage
    const storedProducts = JSON.parse(localStorage.getItem("medicines"));
    if (this.props.location.state?.selectedProducts || storedProducts) {
      const products = this.props.location.state?.selectedProducts || storedProducts;
      const totalPrice = products.reduce((total, product) => total + product.price * product.quantity, 0);

      this.setState({
        medicines: products,
        medicinePrice: totalPrice,
      });

      localStorage.setItem("medicines", JSON.stringify(products));
      localStorage.setItem("medicinePrice", totalPrice);
    }
  }

  addPaypalScript = async () => {
    const data = await getConfig();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => this.setState({ sdkReady: true });
    document.body.appendChild(script);
    console.log(data);
  };

  handleInputChange = (e, field) => {
    const value = e.target.value;
    this.setState({ [field]: value });
    localStorage.setItem(field, value);
  };

  handleConfirm = (e) => {
    e.preventDefault();
    if (!this.validateInput()) return;
    this.setState({ showPaypal: true });
  };

  validateInput = () => {
    const { username, email, phoneNumber } = this.state;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const phoneRegex = /^\d{10}$/;

    if (!username) {
      toast.warning("Vui lòng nhập tên.");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.warning("Email không hợp lệ.");
      return false;
    }
    if (!phoneRegex.test(phoneNumber)) {
      toast.warning("Số điện thoại không hợp lệ.");
      return false;
    }
    return true;
  };

  onSuccessPaypal = async (details, data) => {
    const userId = this.props.userIdNormal;
    const orderData = {
      userId,
      username: this.state.username,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      payment: "PayPal",
      medicines: this.state.medicines,
      totalPrice: this.state.medicinePrice,
    };

    try {
      // Gọi API để tạo đơn hàng
      await createOrderService(orderData);

      // Xóa sản phẩm trong giỏ hàng sau khi đặt hàng thành công
      this.state.medicines.forEach((item) => {
        this.props.removeFromCart(item.id);
      });

      // Cập nhật lại localStorage
      localStorage.removeItem("medicines");
      localStorage.removeItem("medicinePrice");

      // Hiển thị thông báo thành công
      toast.success("Đặt hàng thành công!");

      // Chuyển hướng đến trang thanh toán thành công
      this.props.history.push("/payment-return", { orderData });

    } catch (error) {
      toast.error("Lỗi khi tạo đơn hàng.");
    }
  };

  handleRemoveFromCart = (productId) => {
    this.props.removeFromCart(productId);
    const updatedMedicines = this.state.medicines.filter((item) => item.id !== productId);
    this.setState({ medicines: updatedMedicines });

    // Cập nhật lại localStorage
    localStorage.setItem("medicines", JSON.stringify(updatedMedicines));

    // Cập nhật lại tổng tiền
    const updatedTotalPrice = updatedMedicines.reduce((total, item) => total + item.price * item.quantity, 0);
    this.setState({ medicinePrice: updatedTotalPrice });
    localStorage.setItem("medicinePrice", updatedTotalPrice);
  };

  handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
        this.props.updateCartQuantity(productId, quantity);
        const updatedMedicines = this.state.medicines.map((item) =>
            item.id === productId ? { ...item, quantity } : item
        );

        this.setState({ medicines: updatedMedicines });

        // Cập nhật lại localStorage
        localStorage.setItem("medicines", JSON.stringify(updatedMedicines));

        // Cập nhật lại tổng tiền
        const updatedTotalPrice = updatedMedicines.reduce((total, item) => total + item.price * item.quantity, 0);
        this.setState({ medicinePrice: updatedTotalPrice });
        localStorage.setItem("medicinePrice", updatedTotalPrice);
    }
  };


  handleBackToCart = () => {
    this.props.history.push("/cart");
  };

  render() {
    const { medicines, medicinePrice, showPaypal, username, email, phoneNumber } = this.state;
    console.log(medicines)
    return (
      <div className="order-container">
        <h2>🛒 Xác nhận đơn hàng</h2>

        <div className="order-form">
          <h3>1️⃣ Thông tin người nhận</h3>
          <div className="form-group">
            <label>Tên người nhận:</label>
            <input type="text" value={username} onChange={(e) => this.handleInputChange(e, "username")} />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => this.handleInputChange(e, "email")} />
          </div>

          <div className="form-group">
            <label>Số điện thoại:</label>
            <input type="text" value={phoneNumber} onChange={(e) => this.handleInputChange(e, "phoneNumber")} />
          </div>
        </div>

        <div className="order-summary">
          <h3>2️⃣ Sản phẩm đặt hàng</h3>
          {medicines.map((item) => (
            <div className="order-item" key={item.id}>
              <img src={item.data.image} alt={item.data.name} className="item-image" />
              <div className="item-details">
                <p><strong>{item.data.name}</strong></p>
                <p>{item.price.toLocaleString()} $ x {item.quantity}</p>
                
              </div>
              <div className="cart-item-quantity">
                <div className="cart-item-quantity">
                  <button onClick={() => this.handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => this.handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                </div>

                <button
                  className="remove-button"
                  style={{ backgroundColor: '#e74c3c' }}
                  onClick={() => this.handleRemoveFromCart(item.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-total">
          <h3>3️⃣ Thanh toán</h3>
          <p>Tổng tiền: <strong>{medicinePrice.toLocaleString()} $</strong></p>
          <button className="back-button" onClick={this.handleBackToCart}>
              🔙 Quay lại giỏ hàng
          </button>
          {!showPaypal ? (
            <button className="confirm-button" onClick={this.handleConfirm}>
              ✅ Xác nhận & Thanh toán
            </button>
          ) : (
            <PayPalButton
              amount={medicinePrice}
              onSuccess={this.onSuccessPaypal}
              onError={() => toast.error("Thanh toán thất bại.")}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userIdNormal: state.user.userInfo?.id,
});

const mapDispatchToProps = (dispatch) => ({
  removeFromCart: (productId) => dispatch(removeFromCart(productId)),
  updateCartQuantity: (productId, quantity) => dispatch(updateCartQuantity(productId, quantity)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);
