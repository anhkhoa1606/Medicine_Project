import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.scss"; // File CSS để tạo kiểu
import { FormattedMessage } from "react-intl";
import { Users, Package, Tags, ShoppingCart, BarChart2 } from "lucide-react";
import { USER_ROLE } from "../../utils/constant";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import _ from "lodash";

export const adminMenu = [
  {
    name: "menu.system.header",
    menus: [
      {
        name: "menu.system.system-administrator.user-manage",
        link: "/system/user-manage",
        icon: <Users size={20} />,
      },
      {
        name: "menu.system.system-administrator.product-manage",
        link: "/system/product-manage",
        icon: <Package size={20} />,
      },
      {
        name: "menu.system.system-administrator.category-manage",
        link: "/system/category-manage",
        icon: <Tags size={20} />,
      },
      {
        name: "menu.system.system-administrator.order-manage",
        link: "/system/order-manage",
        icon: <ShoppingCart size={20} />,
      },
      {
        name: "menu.system.system-administrator.revenue",
        link: "/system/revenue",
        icon: <BarChart2 size={20} />,
      },
    ],
  },
];

export const staffMenu = [
  {
    name: "menu.system.header",
    menus: [
      {
        name: "menu.system.system-administrator.product-manage",
        link: "/system/product-manage",
        icon: <Package size={20} />,
      },
      {
        name: "menu.system.system-administrator.category-manage",
        link: "/system/category-manage",
        icon: <Tags size={20} />,
      },
      {
        name: "menu.system.system-administrator.order-manage",
        link: "/system/order-manage",
        icon: <ShoppingCart size={20} />,
      },
      {
        name: "menu.system.system-administrator.revenue",
        link: "/system/revenue",
        icon: <BarChart2 size={20} />,
      },
    ],
  },
];

class DashboardSidebar extends Component {

   componentDidMount() {
      let { userInfo, history } = this.props;
      let menu = [];
      if (userInfo && !_.isEmpty(userInfo)) {
        let role = userInfo.roleId;
        if (role === USER_ROLE.ADMIN) {
          menu = adminMenu;
        }
        if (role === USER_ROLE.STAFF) {
          menu = staffMenu;
        }
        if (role === USER_ROLE.CUSTOMER) {
          history.push("/home");
          return;
        }
      }
      this.setState({ menuApp: menu });
    }
    render() {
      const { menuApp } = this.state || {}; // lấy menuApp từ state
      const { userInfo } = this.props;
      const isLoggedIn = userInfo;
  
      return (
        <div className="sidebar">
          <div className="logo">
            <FormattedMessage id="menu.system.system-administrator.dashboard" />
          </div>
          <ul className="menu">
            {menuApp && menuApp.length > 0 && menuApp.map((menuGroup, index) => (
              <React.Fragment key={index}>
                {menuGroup.menus.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.link}>
                      {item.icon}
                      <span>
                        <FormattedMessage
                          id={item.name}
                          defaultMessage={item.name}
                        />
                      </span>
                    </Link>
                  </li>
                ))}
                <hr />
              </React.Fragment>
            ))}
          </ul>
        </div>
      );
    }
  
}


const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    userGoogle: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardSidebar));
