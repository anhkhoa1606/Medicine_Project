import React, { Component } from "react";
import { connect } from "react-redux";
import "./Footer.scss";
import { withRouter } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Thông tin</h3>
            <ul>
              <li><a href="/about">Giới thiệu</a></li>
              <li><a href="/contact">Liên hệ</a></li>
              <li><a href="/faq">Câu hỏi thường gặp</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Chính sách</h3>
            <ul>
              <li><a href="/privacy-policy">Chính sách bảo mật</a></li>
              <li><a href="/terms">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Kết nối với chúng tôi</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Thuốc hay - Tất cả các quyền được bảo lưu.</p>
        </div>
      </footer>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
  language: state.app.language,
});

export default withRouter(connect(mapStateToProps)(Footer));
