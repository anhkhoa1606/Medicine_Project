import React, { Component } from "react";
import { connect } from "react-redux";
import { getMedicineById } from "../../services/productService";
import "./MedicineDetail.scss";
import { withRouter } from "react-router-dom";
import { addToCart } from "../../store/actions/cartActions";
import { Button, Modal } from "react-bootstrap";
import Header from "./Header"
import Footer from "./Footer";

class MedicineDetail extends Component {
  state = {
    medicine: null,
    cartItems: [],
  };

  componentDidMount() {
    this.fetchMedicineDetail();
  }

  fetchMedicineDetail = async () => {
    const urlParams = new URLSearchParams(this.props.location.search); // Lấy query string từ URL
    const medicineId = urlParams.get("id"); // Lấy giá trị id từ query string

    if (!medicineId) {
      console.error("Missing medicine ID in query parameters.");
      return;
    }

    try {
      let response = await getMedicineById(medicineId);
      
      if (response.data.errCode === 0) {
        this.setState({ medicine: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching medicine details", error);
    }
  };

  // Hàm quay lại trang chủ
  handleBackToHome = () => {
    this.props.history.push("/home");
  };

  // Xử lý thêm sản phẩm vào giỏ hàng
  handleAddToCart = (medicine) => {
    const { userInfo, userGoogle } = this.props;
    const { cartItems } = this.state;

    if (!userInfo || !userGoogle) {
      this.showModal("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    // Kiểm tra sản phẩm đã tồn tại chưa
    const isProductInCart = cartItems.some((item) => item.medicineId === medicine.id);

    if (isProductInCart) {
      this.showModal("❌ Sản phẩm này đã có trong giỏ hàng!");
      return;
    }

    // Thêm vào giỏ hàng nếu chưa có
    const userId = userInfo.id || userGoogle.user.userId;
    this.props.addToCart(userId, medicine, 1);
    this.showModal("✅ Sản phẩm đã được thêm vào giỏ hàng!");

    // Cập nhật giỏ hàng
    this.setState({ cartItems: [...cartItems, { medicineId: medicine.id, quantity: 1 }] });
  };

  // Hiển thị modal thông báo
  showModal = (message) => {
    this.setState({
      showModal: true,
      modalMessage: message,
    });
  };

  // Ẩn modal
  handleCloseModal = () => {
    this.setState({
      showModal: false,
      modalMessage: "",
    });
  };

  render() {
    const { medicine, showModal, modalMessage } = this.state;

    if (!medicine) {
      return (
        <>
          <div className="container text-center loading-screen">
            <h2>Loading...</h2>
          </div>
        </>
      );
    }

    return (
      <>
        <Header/>
        <div className="medicine-detail">
          <div className="detail-wrapper">
            <img src={medicine.image} className="medicine-image" alt={medicine.name} />
            <div className="medicine-info">
              <h2>{medicine.name}</h2>
              <p className="medicine-description">{medicine.description}</p>
              <p className="medicine-price">💰 {medicine.price.toLocaleString()}đ</p>
              <p className="medicine-stock">📦 Số lượng còn lại: {medicine.stock}</p>
              <div className="button-group">
                <button className="buy-button" onClick={() => this.handleAddToCart(medicine)}>🛍️ Thêm vào giỏ hàng</button>
                <button className="back-button-detail" onClick={this.handleBackToHome}>⬅️ Quay lại trang chủ</button>
              </div>
            </div>
          </div>
        </div>

        <Modal show={showModal} onHide={this.handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalMessage}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleCloseModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
        <Footer/>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
  userGoogle: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (userId, product, quantity) => dispatch(addToCart(userId, product, quantity)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicineDetail));
