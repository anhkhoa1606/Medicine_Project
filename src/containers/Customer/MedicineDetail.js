import React, { Component } from "react";
import { connect } from "react-redux";
import { getMedicineById } from "../../services/productService";
import Header from "../Roles/Header";
import "./MedicineDetail.scss";
import { withRouter } from "react-router-dom";

class MedicineDetail extends Component {
  state = {
    medicine: null,
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
      if (response.errCode === 0) {
        this.setState({ medicine: response.data });
      }
    } catch (error) {
      console.error("Error fetching medicine details", error);
    }
  };

  // Hàm quay lại trang chủ
  handleBackToHome = () => {
    this.props.history.push("/");
  };

  render() {
    const { medicine } = this.state;

    if (!medicine) {
      return (
        <>
          <Header />
          <div className="container text-center loading-screen">
            <h2>Loading...</h2>
          </div>
        </>
      );
    }

    return (
      <>
        <Header />
        <div className="container medicine-detail">
          <div className="detail-wrapper">
            <img src={medicine.image} className="medicine-image" alt={medicine.name} />
            <div className="medicine-info">
              <h2>{medicine.name}</h2>
              <p className="medicine-description">{medicine.description}</p>
              <p className="medicine-price">💰 {medicine.price.toLocaleString()}đ</p>
              <p className="medicine-stock">📦 Số lượng còn lại: {medicine.stock}</p>
              <div className="button-group">
                <button className="buy-button">🛍️ Thêm vào giỏ hàng</button>
                <button className="back-button-detail" onClick={this.handleBackToHome}>⬅️ Quay lại trang chủ</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
});

export default withRouter(connect(mapStateToProps, null)(MedicineDetail));
