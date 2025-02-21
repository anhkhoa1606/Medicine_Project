import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, customerMenu } from "../Roles/menuApp";
import "./Header.scss";
import { LANGUAGES, USER_ROLE } from "../../utils/constant";
import _ from "lodash";
import { withRouter } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [],
    };
  }

  handleChangeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
    console.log('changeLanguageAppRedux', language);
  };

  componentDidMount() {
    let { userInfo, history } = this.props;
    console.log('userInfo', userInfo);
    let menu = [];
    if (userInfo && !_.isEmpty(userInfo)) {
      let role = userInfo.roleId;
      console.log('userInfo.roleId', userInfo.roleId)
      if (role === USER_ROLE.ADMIN || role === USER_ROLE.STAFF) {
        menu = adminMenu;
      }
      if (role === USER_ROLE.CUSTOMER) {
        history.push("/home");
      }
    }
    this.setState({ menuApp: menu });
  }

  handleLogout = () => {
    const { processLogout, history } = this.props;
    processLogout();
    history.push('/login');
  }

  toggleCart = () => {
    this.props.history.push("/cart");
  };

  render() {
    const {language, userInfo } = this.props;

    return (
      <div className="header-container">
        {/* Thanh Navigator */}
        <div className="header-tabs-container">
          <Navigator menus={this.state.menuApp} />
        </div>

        <div className="languages">
          <span className="welcome">
            <FormattedMessage id="home-header.welcome" />{" "}
            {userInfo && userInfo.firstName ? userInfo.firstName : " "} !
          </span>
          <span
            className={language === LANGUAGES.VI ? "languages-vi active" : "languages-vi"}
            onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
          >
            VN
          </span>
          <span
            className={language === LANGUAGES.EN ? "languages-en active" : "languages-en"}
            onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
          >
            EN
          </span>

          <div
            className="btn btn-logout"
            onClick={this.handleLogout}
            title="Log out"
          >
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
        <button className="view-cart-button" onClick={this.toggleCart}>
            Cart
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
