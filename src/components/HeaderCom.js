// import React, { Component } from "react";
// import { connect } from "react-redux";
// import "./Header.scss"; // Import CSS file
// import { Search, ShoppingCart, User } from "lucide-react";
// import * as actions from "../store/actions";
// import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

// class HeaderCom extends Component {

//   handleLoginLogout = () => {
//     const { isLoggedIn, processLogout } = this.props;

//     console.log('isLoggedIn', isLoggedIn);
//     if (isLoggedIn) {
//       processLogout();
//       console.log("Logged out");
//     } else {
//       this.props.history.push('/login');
//     }
//   };

//   render() {
//     const { isLoggedIn } = this.props;

//     return (
//       <header className="header">
//         {/* Left Side */}
//         <div className="header-left">
//           <img
//             src="/logo.png"
//             alt="Nhà thuốc Long Châu"
//             className="logo"
//           />
//           <span className="title">NHÀ THUỐC LONG CHÂU</span>
//         </div>

//         {/* Search Bar */}
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
//             className="search-input"
//           />
//           <button className="search-button">
//             <Search size={20} />
//           </button>
//         </div>

//         {/* Right Side */}
//         <div className="header-right">
//           <a
//             href="#"
//             className="login-link"
//             onClick={this.handleLoginLogout}
//           >
//             <User size={20} /> {isLoggedIn ? "Log out" : "Log in"}
//           </a>
//           <a href="#" className="cart">
//             <ShoppingCart size={24} />
//             <span className="cart-count">0</span>
//           </a>
//         </div>
//       </header>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     isLoggedIn: state.user.isLoggedIn,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     processLogout: () => dispatch(actions.processLogout()),
//   };
// };

// export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderCom));
