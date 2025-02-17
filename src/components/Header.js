import React, { Component } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import "./Header.scss"; // Import CSS file

class Header extends Component {
  render() {
    return (
      <header className="header">
        {/* Left Side */}
        <div className="header-left">
          <img
            src="/logo.png" // Thay logo phù hợp
            alt="Nhà thuốc Long Châu"
            className="logo"
          />
          <span className="title">NHÀ THUỐC LONG CHÂU</span>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
            className="search-input"
          />
          <button className="search-button">
            <Search size={20} />
          </button>
        </div>

        {/* Right Side */}
        <div className="header-right">
          <a href="#" className="login-link">
            <User size={20} /> Đăng nhập
          </a>
          <a href="#" className="cart">
            <ShoppingCart size={24} />
            <span className="cart-count">0</span>
          </a>
        </div>
      </header>
    );
  }
}

export default Header;
