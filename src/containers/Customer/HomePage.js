import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllProducts } from "../../services/productService";
import { addToCart } from "../../store/actions/cartActions";
import { getCartByUserId } from "../../services/cartService";
import Header from "../Roles/Header";
import { Modal, Button } from "react-bootstrap"; // Thêm modal từ Bootstrap
import "./HomePage.scss";
import { withRouter } from "react-router-dom";

class HomePage extends Component {
  state = {
    products: [],
    cartItems: [],
    showModal: false,         // Kiểm soát hiển thị modal
    modalMessage: "",         // Nội dung thông báo modal
  };

  componentDidMount() {
    this.fetchProducts();
    this.fetchCartData();
  }

  // Lấy danh sách sản phẩm
  fetchProducts = async () => {
    try {
      let response = await getAllProducts();
      if (response.errCode === 0) {
        this.setState({ products: response.data });
      }
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // Lấy giỏ hàng của người dùng
  fetchCartData = async () => {
    const { userInfo } = this.props;
    if (userInfo) {
      try {
        const response = await getCartByUserId(userInfo.id);
        if (response && response.cartItems) {
          this.setState({ cartItems: response.cartItems });
        }
      } catch (error) {
        console.error("Error fetching cart data", error);
      }
    }
  };

  // Xử lý thêm sản phẩm vào giỏ hàng
  handleAddToCart = (product) => {
    const { userInfo } = this.props;
    const { cartItems } = this.state;

    if (!userInfo) {
      this.showModal("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    // Kiểm tra sản phẩm đã tồn tại chưa
    const isProductInCart = cartItems.some((item) => item.medicineId === product.id);

    if (isProductInCart) {
      this.showModal("❌ Sản phẩm này đã có trong giỏ hàng!");
      return;
    }

    // Thêm vào giỏ hàng nếu chưa có
    const userId = userInfo.id;
    this.props.addToCart(userId, product, 1);
    this.showModal("✅ Sản phẩm đã được thêm vào giỏ hàng!");

    // Cập nhật giỏ hàng
    this.setState({ cartItems: [...cartItems, { medicineId: product.id, quantity: 1 }] });
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
    const { products, showModal, modalMessage } = this.state;

    return (
      <>
        <Header />
        <div className="container">
          <h2 className="text-center">🛒 Danh sách sản phẩm</h2>
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <img src={product.image} className="product-image" alt={product.name} />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price.toLocaleString()}đ</p>
                <button
                  className="buy-button"
                  onClick={() => this.handleAddToCart(product)}
                >
                  🛍️ Chọn mua
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal thông báo */}
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
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (userId, product, quantity) => dispatch(addToCart(userId, product, quantity)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
