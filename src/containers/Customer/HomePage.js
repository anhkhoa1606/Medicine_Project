import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllProducts } from "../../services/productService";
import { addToCart } from "../../store/actions/cartActions";
import { getCartByUserId } from "../../services/cartService";
import Header from "../Roles/Header";
import { Modal, Button } from "react-bootstrap";
import "./HomePage.scss";
import { withRouter } from "react-router-dom";
import Footer from "../Roles/Footer";

class HomePage extends Component {
  state = {
    products: [],
    cartItems: [],
    showModal: false,         // Kiểm soát hiển thị modal
    modalMessage: "",         // Nội dung thông báo modal
    currentPage: 1,           // Trang hiện tại
    totalPages: 1,            // Tổng số trang
    limit: 8,
  };

  componentDidMount() {
    this.fetchProducts(this.state.currentPage);
    this.fetchCartData();
  }

  // Lấy danh sách sản phẩm
  fetchProducts = async (page) => {
    try {
      let response = await getAllProducts(page, this.state.limit);
      console.log('response', response);
      if (response.data.errCode === 0) {
        this.setState({
          products: response.data.data,
          totalPages: response.data.pagination.totalPages,
          currentPage: response.data.pagination.currentPage
        });
      }
    } catch (error) {
      console.error("Error fetching products", error);
    }
};


  // Chuyển trang
  handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= this.state.totalPages) {
      this.fetchProducts(newPage);
    }
  };

  // Lấy giỏ hàng của người dùng
  fetchCartData = async () => {
    const { userIdNormal } = this.props;
    if (userIdNormal) {
      try {
        const response = await getCartByUserId(userIdNormal);
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
    const { userIdNormal } = this.props;
    const { cartItems } = this.state;

    if (!userIdNormal) {
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
    const userId = userIdNormal;
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

  handleViewDetail = (medicineId) => {
    this.props.history.push(`/medicine-details?id=${medicineId}`);
  };
  render() {
    const { products, showModal, modalMessage, currentPage, totalPages } = this.state;

    return (
      <>
        <Header />
        <div className="background"></div>
        <div className="container">
          <h2 className="text-center">🛒 Danh sách sản phẩm</h2>
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <img src={product.image} className="product-image" alt={product.name} />
                <h3 className="product-name">Name: {product.name}</h3>
                <p className="product-price">Price: {product.price.toLocaleString()} đ</p>
                <button
                  className="buy-button"
                  onClick={() => this.handleAddToCart(product)}
                >
                  🛍️ Chọn mua
                </button>
                <button
                  className="detail-button"
                  onClick={() => this.handleViewDetail(product.id)}
                >
                  🔍 Xem chi tiết
                </button>
              </div>
            ))}
          </div>
          {/* Nút chuyển trang */}
          <div className="pagination">
            <Button
              variant="secondary"
              onClick={() => this.handlePageChange(this.state.currentPage - 1)}
              disabled={this.state.currentPage === 1}
            >
              ⬅️ Previous
            </Button>

            <span className="page-info">Trang {this.state.currentPage} / {this.state.totalPages}</span>

            <Button
              variant="secondary"
              onClick={() => this.handlePageChange(this.state.currentPage + 1)}
              disabled={this.state.currentPage === this.state.totalPages}
            >
              Next ➡️
            </Button>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
