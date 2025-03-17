import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu } from "../Roles/menuApp";
import "./Header.scss";
import { LANGUAGES, USER_ROLE } from "../../utils/constant";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import image1 from '../../assets/images/pngwing.com.png';
import flagVN from '../../assets/images/vn.png';
import flagEN from '../../assets/images/england.jpg';
import ReactSelect from "react-select";

const options = [
  { value: LANGUAGES.VI, image: flagVN },
  { value: LANGUAGES.EN, image: flagEN },
];

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [],
    };
  }
  formatOptionLabel = (option) => (
    <div>
      <img width={50} height={30} src={option.image} alt={option.label} />
    </div>
  );

  handleChangeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };

  componentDidMount() {
    let { userInfo } = this.props;
    console.log('userInfo', userInfo);
    let menu = [];
    if (userInfo && !_.isEmpty(userInfo)) {
      let role = userInfo.roleId;
      console.log('userInfo.roleId', userInfo.roleId)
      if (role === USER_ROLE.ADMIN) {
        menu = adminMenu;
      }
      if (role === USER_ROLE.STAFF) {
        menu = adminMenu;
      }
      if (role === USER_ROLE.CUSTOMER) {
      }
    }
    this.setState({ menuApp: menu });
  }

  handleLogout = () => {
    const { processLogout, history } = this.props;
    processLogout();
    history.push('/login');
  }
  handleProfile = () => {
    const {history } = this.props;
    history.push('/profile');
  }

  toggleCart = () => {
    this.props.history.push("/cart");
  };

  handleHome = () => {
    const {history } = this.props;
    history.push('/home');
  }

  render() {
    const {language, userInfo, userGoogle } = this.props;
    const customStyles = {
      indicatorSeparator: () => ({}),
      dropdownIndicator: () => ({ display: "none" }),
      option: (provided, state) => ({
        ...provided,
      }),
      control: () => ({
        width: 70,
      }),
    };

    return (
      <div className="header-container">
        <div className="header-tabs-container">
          <div className="header-logo" onClick={this.handleHome}>
            <img src={image1} alt="Logo" />
            <div className="title-header">Medicine</div>
          </div>
          <Navigator menus={this.state.menuApp} className="custom-navigator"/>
        </div>
        <div className="languages">
          <span className="welcome" onClick={this.handleProfile}>
            <FormattedMessage id="home-header.welcome" />{" "}
            {(userInfo?.email || userGoogle?.user?.email || " ")} !
          </span>

          <button className="view-cart-button" onClick={this.toggleCart}>
            <i className="fas fa-shopping-cart"></i>
          </button>
          <ReactSelect
            defaultValue={options[0]}
            styles={customStyles}
            options={options}
            formatOptionLabel={this.formatOptionLabel}
            onChange={(option) => this.handleChangeLanguage(option.value)}
          />

          <div
            className="btn btn-logout"
            onClick={this.handleLogout}
            title="Log out"
          >
            <i className="fas fa-sign-out-alt"></i>
          </div>
          
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    userGoogle: state.user,
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
