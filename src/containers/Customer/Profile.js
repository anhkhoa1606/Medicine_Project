import React, { Component } from "react";
import { connect } from "react-redux";
import { getUserById, editUserServices } from "../../services/userService"; // Import your service methods
import "./Profile.scss";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

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
    const { userInfo } = this.props;
    try {
      const response = await getUserById(userInfo.id);
      console.log(response.data)
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
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSaveChanges = async () => {
    const { user } = this.state; // Get the current user object from state
    const { name, email, phone, address } = this.state;
  
    if (!user) {
      console.error("User not found.");
      return;
    }
  
    try {
      // Include the user ID along with the data to be updated
      const inputData = { id: user.id, name, email, phone, address };
      
      const response = await editUserServices(inputData); // Send updated data to the server
  
      if (response.errCode === 0) {
        this.setState({ isEditing: false });
        this.fetchUserInfo(); // Refresh user info after successful update
      } else {
        this.setState({ errorMessage: "Failed to update user information." });
      }
    } catch (error) {
      console.error("Error updating user info", error);
      this.setState({ errorMessage: "Error occurred while updating." });
    }
  };
  

  handleBackToHome = () => {
    const {history } = this.props;
    history.push('/home');
  }


  render() {
    const { user, isEditing, name, email, phoneNumber, address, errorMessage } = this.state;
    if (!user) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <Header />
        <div className="container profile-detail">
          <div className="profile-wrapper">
            <h2>User Profile</h2>
            <div className="profile-info">
              <div className="profile-field">
                <label>Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  <p>{user.firstName} {user.lastName}</p>
                )}
              </div>
              <div className="profile-field">
                <label>Email:</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  <p>{user.email}</p>
                )}
              </div>
              <div className="profile-field">
                <label>Phone:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  <p>{user.phoneNumber}</p>
                )}
              </div>
              <div className="profile-field">
                <label>Address:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={address}
                    onChange={this.handleInputChange}
                  />
                ) : (
                  <p>{user.address}</p>
                )}
              </div>
              {/* Error Message */}
              {errorMessage && <div className="error-message">{errorMessage}</div>}

              <div className="button-group">
                {isEditing ? (
                  <button className="save-button" onClick={this.handleSaveChanges}>
                    Save Changes
                  </button>
                ) : (
                  <button className="edit-button" onClick={this.handleEditToggle}>
                    Edit Profile
                  </button>
                )}
                <button className="back-button" onClick={this.handleBackToHome}>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo, // Assuming you have userInfo in your Redux store
});

const mapDispatchToProps = (dispatch) => ({
  // Add any actions if necessary
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
