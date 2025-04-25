import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllProducts } from "../../services/productService";
import { addToCart, checkCartAction } from "../../store/actions/cartActions";
import { getCartByUserId } from "../../services/cartService";
import { Modal, Button } from "react-bootstrap";
import "./HomePage.scss";
import { withRouter } from "react-router-dom";
import Footer from "../Customer/Footer";
import ChatBox from "./ChatBox";
import Roles from "../Roles/Roles";
import { FormattedMessage } from "react-intl";
import image1 from '../../assets/images/ani-kolleshi-7jjnJ-QA9fY-unsplash.jpg';
import image2 from '../../assets/images/national-cancer-institute-L8tWZT4CcVQ-unsplash.jpg';
import image3 from '../../assets/images/julia-zyablova-S1v7hVUiCg0-unsplash.jpg';
import image4 from '../../assets/images/laurynas-me-1TL8AoEDj_c-unsplash.jpg';
import image5 from '../../assets/images/lucas-vasques-9vnACvX2748-unsplash.jpg';
class HomePage extends Component {
  state = {
    products: [],
    cartItems: [],
    showModal: false,         // Kiểm soát hiển thị modal
    modalMessage: "",         // Nội dung thông báo modal
    currentPage: 1,           // Trang hiện tại
    totalPages: 1,            // Tổng số trang
    limit: 8,
    searchQuery: "",
    filteredProducts: [], 
  };

  componentDidMount() {
    this.fetchProducts(this.state.currentPage);
    this.fetchCartData();
  }

  fetchProducts = async (page) => {
    try {
      let response = await getAllProducts(page, this.state.limit);
      console.log('response', response);
      if (response.data.errCode === 0) {
        this.setState({
          products: response.data.data,
          filteredProducts: response.data.data,
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
  handleAddToCart = async (product) => {
    const { userInfo } = this.props;

    if (!userInfo) {
        this.showModal("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
    }

    try {
        // Gọi API kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const response = await this.props.checkCartAction(userInfo.id, product.id);
        console.log('response', response, userInfo.id, product.id);
        if (response.exists) {
            this.showModal("❌ Sản phẩm này đã có trong giỏ hàng!");
        } else {
            // Gửi API để thêm sản phẩm vào giỏ hàng
            await this.props.addToCart(userInfo.id, product.id, 1);
            console.log('response222',userInfo.id, product.id);

            this.showModal("✅ Sản phẩm đã được thêm vào giỏ hàng!");

            // Cập nhật lại giỏ hàng sau khi thêm
            this.setState((prevState) => ({
                cartItems: [...prevState.cartItems, { medicineId: product.id, quantity: 1 }]
            }));
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra giỏ hàng:", error);
        this.showModal("⚠️ Đã xảy ra lỗi, vui lòng thử lại!");
    }
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

  handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    this.setState({ searchQuery: query });

    const filteredProducts = this.state.products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    console.log('filteredProducts', filteredProducts)

    this.setState({ filteredProducts });
  };
  render() {
    const { filteredProducts, showModal, modalMessage, searchQuery } = this.state;

    return (
      <>
        <ChatBox />
        <Roles />
        <div className="homepage">
          <div className="background-container">
            <div className="background-slider">
              <img src={image1} alt="Slide 1" />
              <img src={image2} alt="Slide 2" />
              <img src={image3} alt="Slide 3" />
              <img src={image4} alt="Slide 4" />
              <img src={image5} alt="Slide 5" />
            </div>
            <div className="overlay">
              <div className="title-body">Welcome to Medicine</div>
              <div className="subtitle-body">Your Trusted Partner in Healthcare and Wellness</div>
            </div>
          </div>

          <div className="container">
            <h2 className="text-center">🛒 <FormattedMessage id="body.list-product" /></h2>
            {/* Thanh tìm kiếm */}
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={this.handleSearchChange}
              />
            </div>

            {/* Danh sách sản phẩm */}
            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div className="product-card" key={product.id}>
                    <img src={product.image} className="product-image" alt={product.name} />
                    <h3 className="product-name"><FormattedMessage id="body.name" />: {product.name}</h3>
                    <p className="product-price"><FormattedMessage id="body.price" />: {product.price.toLocaleString()} đ</p>
                    <button className="buy-button" onClick={() => this.handleAddToCart(product)}>
                      🛍️ <FormattedMessage id="body.choose" />
                    </button>
                    <button className="detail-button" onClick={() => this.handleViewDetail(product.id)}>
                      🔍 <FormattedMessage id="body.detail" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-results"><FormattedMessage id="body.not" /></p>
              )}
            </div>

            {/* Nút chuyển trang */}
            <div className="pagination">
              <Button
                variant="secondary"
                onClick={() => this.handlePageChange(this.state.currentPage - 1)}
                disabled={this.state.currentPage === 1}
              >
                ⬅️ <FormattedMessage id="body.previous" />
              </Button>

              <span className="page-info"><FormattedMessage id="body.page" /> {this.state.currentPage} / {this.state.totalPages}</span>

              <Button
                variant="secondary"
                onClick={() => this.handlePageChange(this.state.currentPage + 1)}
                disabled={this.state.currentPage === this.state.totalPages}
              >
                <FormattedMessage id="body.next" /> ➡️
              </Button>
            </div>
          </div>
            <Footer/>
        </div>
        <Modal show={showModal} onHide={this.handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title><FormattedMessage id="body.notification" /></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalMessage}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleCloseModal}>
            <FormattedMessage id="body.close" />
            </Button>
          </Modal.Footer>
        </Modal>
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
  checkCartAction: (userId, medicineId) => dispatch(checkCartAction(userId, medicineId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
