import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.scss"; // File CSS để tạo kiểu
import { FormattedMessage } from "react-intl";
import { Users, Package, Tags, ShoppingCart, BarChart2 } from "lucide-react";

export const adminMenu = [
    {
      name: "menu.system.header",
      menus: [
        { name: "menu.system.system-administrator.user-manage", link: "/system/user-manage", icon: <Users size={20} /> },
        { name: "menu.system.system-administrator.product-manage", link: "/system/product-manage", icon: <Package size={20} /> },
        { name: "menu.system.system-administrator.category-manage", link: "/system/category-manage", icon: <Tags size={20} /> },
        { name: "menu.system.system-administrator.order-manage", link: "/system/order-manage", icon: <ShoppingCart size={20} /> },
        { name: "menu.system.system-administrator.revenue", link: "/system/revenue", icon: <BarChart2 size={20} /> },
      ],
    },
  ];

class DashboardSidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <div className="logo"><FormattedMessage id="menu.system.system-administrator.dashboard" /></div>
        <ul className="menu">
          {adminMenu.map((menuGroup, index) => (
            <React.Fragment key={index}>
              {menuGroup.menus.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.link}>
                    {item.icon}
                    <span><FormattedMessage id={item.name} defaultMessage={item.name} /></span>
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

export default DashboardSidebar;
