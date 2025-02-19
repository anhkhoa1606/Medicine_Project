import React, { Component } from "react";
import { connect } from "react-redux";
import "./Order.scss"; 
import Modal from "react-bootstrap/Modal";
import { storeOrderData } from "../../store/actions";
import { getOrderService } from "../../services/orderService";
import { FormattedMessage } from "react-intl";
// import Header from "../../components/Header";
import Header from "../Roles/Header";

class PaymentReturn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrOrders: [],
      showModal: false,
      showModalCancle: false,
      selectedOrder: null,
    };
  }
  async componentDidMount() {
    try {
      let userId = this.props.userId;
      console.log(userId);

      let ordersArray;

      // Fetch orders
      const orders = await getOrderService(userId);
      console.log("Orders:", orders.order);

      const userOrders = orders.order.filter(
        (order) => order.userId === userId
      );

      // If orders is an array, use it directly. If not, convert it to an array.
      ordersArray = Array.isArray(userOrders)
        ? userOrders
        : Object.values(orders.order);

      this.setState({
        arrOrders: ordersArray,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }
  
  async componentDidUpdate(prevProps, prevState) {
    // Check if userId prop has changed
    if (this.props.userId !== prevProps.userId) {
      // If userId prop has changed, save it to localStorage
      localStorage.setItem("userId", this.props.userId);
    }

    // Check if arrOrders state has changed
    if (this.state.arrOrders !== prevState.arrOrders) {
      // If arrOrders state has changed, save it to localStorage
      localStorage.setItem("arrOrders", JSON.stringify(this.state.arrOrders));
    }
  }
  handleHome = () => {
    if (this.props.history) {
      this.props.history.push(`/profile`);
    }
  };
  handleConfirm = (item) => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
      selectedOrder: item, // Set the selected order
    }));
  };
  handleCancle = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
      selectedOrder: null, // Reset the selected order
    }));
  };
  render() {
    let arrOrders = this.state.arrOrders;
    console.log(arrOrders);
    return (
      <>
        <Header toggleCart={this.toggleCartView} />
        <div className="order-container">
          <h3>
            <FormattedMessage id="payment.title" />
          </h3>
          <div className="recheck-products">
            <table>
              <tbody>
                <tr>
                  <th>
                    {" "}
                    <FormattedMessage id="payment.username" />
                  </th>
                  <th>Email</th>
                  <th>
                    {" "}
                    <FormattedMessage id="payment.phonenumber" />
                  </th>
                  <th>
                    {" "}
                    <FormattedMessage id="payment.payment" />
                  </th>
                  <th>
                    {" "}
                    <FormattedMessage id="payment.courses" />
                  </th>
                  <th>
                    {" "}
                    <FormattedMessage id="payment.total_price" />
                  </th>
                  <th>
                    {" "}
                    <FormattedMessage id="payment.status" />
                  </th>
                  <th>
                    {" "}
                    <FormattedMessage id="payment.actions" />
                  </th>
                </tr>
                {arrOrders.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.username}</td>
                      <td>{item.email}</td>
                      <td>{item.phonenumber}</td>
                      <td>{item.payment}</td>
                      {/* <td>{item.courses.name}</td> */}
                      <td>{item.totalPrice}</td>
                      <td>
                        {" "}
                        <FormattedMessage id="payment.paid" />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => this.handleConfirm(item)} // Pass the item to the handler
                        >
                          <FormattedMessage id="payment.see_details" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Modal show={this.state.showModal} onHide={this.handleConfirm}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {" "}
                  <FormattedMessage id="payment.order_detail" />
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <table>
                  <tbody>
                    <tr>
                      <th>Email</th>
                      <th>
                        {" "}
                        <FormattedMessage id="payment.phonenumber" />
                      </th>
                      <th>
                        {" "}
                        <FormattedMessage id="payment.payment" />
                      </th>
                      <th>
                        {" "}
                        <FormattedMessage id="payment.courses" />
                      </th>
                      <th>
                        {" "}
                        <FormattedMessage id="payment.total_price" />
                      </th>
                    </tr>
                    {this.state.selectedOrder && ( // Check if selectedOrder exists
                      <tr>
                        <td>{this.state.selectedOrder.email}</td>
                        <td>{this.state.selectedOrder.phonenumber}</td>
                        <td>{this.state.selectedOrder.courses.name}</td>
                        <td>{this.state.selectedOrder.payment}</td>
                        <td>{this.state.selectedOrder.totalPrice}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="pr-5">
                  {" "}
                  <FormattedMessage id="payment.status2" />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="btn btn-secondary"
                  onClick={this.handleCancle}
                >
                  <FormattedMessage id="payment.close" />
                </button>
              </Modal.Footer>
            </Modal>
          </div>
          <div className="content-checkout">
            <div className="bottom-content d-flex">
              <div className="back-cart d-flex" onClick={this.handleHome}>
                <i className="fas fa-chevron-left mt-1 mr-2 ml-3"></i>
                <div>
                  {" "}
                  <FormattedMessage id="payment.back" />
                </div>
              </div>
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
    cart: state.cart,
    userId: state.user.userInfo?.id || state.user.user?.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // storeOrderData: (orderData) => dispatch(storeOrderData(orderData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentReturn);