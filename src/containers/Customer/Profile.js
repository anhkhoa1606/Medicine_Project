import React, { Component } from "react";
import { connect } from "react-redux";
import { getUserById, editUserServices } from "../../services/userService";
import { withRouter } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaArrowLeft } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import "./Profile.scss";
import { FormattedMessage } from "react-intl";

class Profile extends Component {
  state = {
    user: null,
    isEditing: false,
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    errorMessage: "",
  };

  componentDidMount() {
    this.fetchUserInfo();
  }

  fetchUserInfo = async () => {
    const { userInfo, userGoogle } = this.props;
    try {
      const response = await getUserById(userInfo?.id || userGoogle?.user?.userId);
      if (response.errCode === 0) {
        this.setState({
          user: response.data,
          name: response.data.firstName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          address: response.data.address,
        });
      }
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  handleEditToggle = () => {
    this.setState((prevState) => ({ isEditing: !prevState.isEditing }));
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSaveChanges = async () => {
    const { user, name, email, phoneNumber, address } = this.state;
    if (!user) return;
    try {
      const response = await editUserServices({ id: user.id, name, email, phoneNumber, address });
      if (response.errCode === 0) {
        this.setState({ isEditing: false });
        this.fetchUserInfo();
      } else {
        this.setState({ errorMessage: "Failed to update user information." });
      }
    } catch (error) {
      this.setState({ errorMessage: "Error occurred while updating." });
    }
  };

  handleBackToHome = () => {
    this.props.history.push("/home");
  };

  render() {
    const { user, isEditing, name, email, phoneNumber, address, errorMessage } = this.state;
    if (!user) return <div className="loading">Loading...</div>;

    return (
      <>
        <Header />
        <div className="profile-container">
          <div className="profile-card">
            <h2><FaUser /><FormattedMessage id="profile.title" /></h2>
            <div className="profile-info">
              {this.renderProfileField("Name", name, "name", isEditing, FaUser)}
              {this.renderProfileField("Email", email, "email", isEditing, FaEnvelope)}
              {this.renderProfileField("Phone", phoneNumber, "phoneNumber", isEditing, FaPhone)}
              {this.renderProfileField("Address", address, "address", isEditing, FaMapMarkerAlt)}
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <div className="button-group">
                {isEditing ? (
                  <button className="save-button" onClick={this.handleSaveChanges}><FaSave /><FormattedMessage id="profile.save" /></button>
                ) : (
                  <button className="edit-button" onClick={this.handleEditToggle}><FaEdit /><FormattedMessage id="profile.edit" /></button>
                )}
                <button className="back-button" onClick={this.handleBackToHome}><FaArrowLeft /><FormattedMessage id="profile.back" /></button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  renderProfileField(label, value, name, isEditing, Icon) {
    return (
      <div className="profile-field">
        <label><Icon /> {label}:</label>
        {isEditing ? (
          <input type="text" name={name} value={value} onChange={this.handleInputChange} />
        ) : (
          <p>{value}</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
  userGoogle: state.user,
});

export default withRouter(connect(mapStateToProps)(Profile));
