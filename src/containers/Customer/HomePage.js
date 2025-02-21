import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllProducts } from "../../services/productService";
import { addToCart } from "../../store/actions/cartActions";
import Header from "../Roles/Header";
import "./HomePage.scss";
import { withRouter } from "react-router-dom";

class HomePage extends Component {
  state = {
    products: [],
  };

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      let response = await getAllProducts();
      console.log('response.data', response.data);
      if (response.errCode === 0) {
        this.setState({ products: response.data });
      }
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  handleAddToCart = (product) => {
    let { userInfo } = this.props;
    if (!userInfo) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    let userId = userInfo.id;
    console.log('userId', userId);
    this.props.addToCart(userId, product, 1);
    console.log('product', product);
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };

   

  render() {
    const { products } = this.state;

    return (
      <>
        <Header />
        <div className="container">
          <h2 className="text-center">Danh sách sản phẩm</h2>
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <img src={product.image} className="product-image" alt={product.name} />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price}đ</p>
                <button className="buy-button" onClick={() => this.handleAddToCart(product)}>
                  Chọn mua
                </button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (userId, product, quantity) => dispatch(addToCart(userId, product, quantity)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
