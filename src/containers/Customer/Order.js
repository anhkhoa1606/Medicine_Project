import React, { Component } from "react";
import { connect } from "react-redux";
import "./Order.scss";
import { createOrderService } from "../../services/orderService";
import { getConfig } from "../../services/paymentService";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import { PayPalButton } from "react-paypal-button-v2";
import * as actions from "../../store/actions";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      phoneNumber: "",
      payment: "PayPal",
      medicines: "",
      medicinePrice: "",
      detailCourses: "",
      sdkReady: false,
      showPaypal: false,
    };
  }
  async componentDidMount() {
    if (!window.paypal) {
      this.addPaypalScript();
    } else {
      this.setState({
        sdkReady: true,
      });
    }
    if (this.props.location.state) {
      let selectedProducts = this.props.location.state.selectedProducts;
      
      if (!Array.isArray(selectedProducts)) {
        selectedProducts = [selectedProducts];
      }
  
      const medicinePrice = selectedProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
  
      this.setState({
        medicines: selectedProducts,
        medicinePrice: medicinePrice,
      });
    } else {
      console.error("No selected products or invalid data.");
    }
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  handleOnChangeInput = (event, id) => {
    console.log(event.target.value);
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  handleReturnHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };
  handleConfirm = async (event) => {
    event.preventDefault();
    if (!this.validateInput()) {
      return;
    }
    this.setState({ showPaypal: true });
  };
  addPaypalScript = async () => {
    let data = await getConfig();
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      this.setState({
        sdkReady: true,
      });
    };
    document.body.appendChild(script);
    console.log(data);
  };
  onSuccessPaypal = async (details, data) => {
    toast.success("Payment completed successfully", details, data);
    const userId = this.props.userIdNormal || this.props.userIdGoogle;
    const orderData = {
      userId,
      username: this.state.username,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      payment: "PayPal",
      medicines: this.state.medicines,
      totalPrice: this.state.medicinePrice,
    };
    console.log(orderData);
    createOrderService(orderData)
      .then(async (response) => {
        toast.success("Order created successfully", response);
        this.props.history.push("/payment-return", { orderData });
        this.props.addPurchasedCourse(this.state.medicines.id);
      })
      .catch((error) => {
        console.error("Error creating order", error);
      });
  };
  validateInput = () => {
    const { username, email, phoneNumber } = this.state;

    // Check if username is not empty
    if (!username) {
      toast.warning("Username is required");
      return false;
    }

    // Check if email is valid
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      toast.warning("Email is not valid");
      return false;
    }

    // Check if phone number is valid
    const phoneRegex = /^\d{10}$/; // Change this regex to match your country's phone number format
    if (!phoneRegex.test(phoneNumber)) {
      toast.warning("Phone number is not valid");
      return false;
    }

    // If all checks pass, return true
    return true;
  };
  render() {
    console.log(this.state.payment);
    let { medicinePrice, medicines, showPaypal } = this.state;
    console.log('medicines12: ', medicines);
    const { userIdNormal } = this.props;
    console.log(userIdNormal);
    if (!Array.isArray(medicines)) {
      return <p>Loading...</p>;
    }

    return (
      <>
        <div className="order-container">
          <div className="address-container ">
            <form>
              <h3>
                {" "}
                <FormattedMessage id="order.orderinfor" />
              </h3>
              <div className="username">
                <label for="username">
                  <b>
                    {" "}
                    <FormattedMessage id="order.username" /> :
                  </b>
                </label>
                <input
                  className="username"
                  type="text"
                  value={this.state.username}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "username")
                  }
                />
              </div>
              <div className="email">
                <label for="email">
                  <b>Email : </b>
                </label>
                <input
                  className="email"
                  type="text"
                  value={this.state.email}
                  onChange={(event) => this.handleOnChangeInput(event, "email")}
                />
              </div>
              <div className="phone-number">
                <label for="phoneNumber">
                  <b>
                    {" "}
                    <FormattedMessage id="order.phoneNumber" /> :
                  </b>
                </label>
                <input
                  className="phoneNumber"
                  type="text"
                  value={this.state.phoneNumber}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "phoneNumber")
                  }
                />
              </div>
            </form>
          </div>
          <div className="payment-container">
            <h3>
              {" "}
              <FormattedMessage id="order.payment" />
            </h3>
            <select
              className="payment"
              value={this.state.payment}
              onChange={(event) => this.handleOnChangeInput(event, "payment")}
            >
              <option value="VN Pay">PayPal</option>
            </select>
          </div>
          <div className="recheck-products">
            <h3>
              {" "}
              <FormattedMessage id="order.recheck" />
            </h3>
            {medicines.map((item) => (
              <div className="transport d-flex" key={item.id}>
                <div className="name align-self-center">{item.name}</div>
                <div className="price align-self-center">{item.price} $</div>
              </div>
            ))}
          </div>
          <div className="content-checkout">
            <div className="top-content ">
              <div className="price d-flex">
                <div className="mr-5">
                  {" "}
                  <FormattedMessage id="order.money" />
                </div>
                <div>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(medicinePrice)}
                </div>
              </div>
              <div className="total d-flex">
                <div className="mr-5">
                  {" "}
                  <FormattedMessage id="order.total" />
                  (gồm VAT)
                </div>
                <div>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(medicinePrice)}
                </div>
              </div>
            </div>
            <div className="bottom-content d-flex">
              <div
                className="back-cart d-flex"
                onClick={() => this.handleReturnHome()}
              >
                <i class="fas fa-chevron-left mt-1 mr-2 ml-3"></i>
                <div>
                  {" "}
                  <FormattedMessage id="order.back" />
                </div>
              </div>

              {!showPaypal && (
                <button className="confirm" onClick={this.handleConfirm}>
                  Xác nhận Thanh Toán
                </button>
              )}
              {showPaypal && (
                <PayPalButton
                  amount={medicinePrice}
                  // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                  onSuccess={this.onSuccessPaypal}
                  onError={() => {
                    toast.warning("Error ");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    userIdNormal: state.user.userInfo?.id || state.user.user?.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // clearOrder: () => dispatch(actions.clearOrder()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);