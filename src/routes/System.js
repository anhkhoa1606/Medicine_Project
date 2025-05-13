import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/UserManage";
import ProductManage from "../containers/System/ProductManage";
import OrderManage from "../containers/System/OrderManage";
import CategoryManage from "../containers/System/CategoryManage";
import Rechart from "../containers/System/Rechart";
import { USER_ROLE } from "../utils/constant";

class System extends Component {
  render() {
    const { systemMenuPath, userInfo } = this.props;
    let role = userInfo?.roleId;
    return (
      <div className="system-container">
        <div className="system-list">
          <Switch>
            {role === USER_ROLE.ADMIN && (
              <>
                <Route path="/system/user-manage" component={UserManage} />
                <Route
                  path="/system/product-manage"
                  component={ProductManage}
                />
                <Route
                  path="/system/category-manage"
                  component={CategoryManage}
                />
                <Route path="/system/order-manage" component={OrderManage} />
                <Route path="/system/revenue" component={Rechart} />
              </>
            )}

            {/* ROLE STAFF: không có user-manage */}
            {role === USER_ROLE.STAFF && (
              <>
                <Route
                  path="/system/product-manage"
                  component={ProductManage}
                />
                <Route
                  path="/system/category-manage"
                  component={CategoryManage}
                />
                <Route path="/system/order-manage" component={OrderManage} />
                <Route path="/system/revenue" component={Rechart} />
              </>
            )}

            <Route
              component={() => {
                return <Redirect to={systemMenuPath} />;
              }}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
