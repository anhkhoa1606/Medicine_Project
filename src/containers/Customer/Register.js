import React, { Component } from 'react';
import './Register.scss';
import { FormattedMessage } from 'react-intl';
import { createNewUserServices } from '../../services/userService'; // Import hàm tạo người dùng
import './Register.scss';
import { Header } from 'antd/es/layout/layout';
import Roles from '../Roles/Roles';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            gender: '',
            roleId: 'customer',
            registerError: '',
            successMessage: ''
        };
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleRegister = async () => {
        const { email, password, firstName, lastName, address, phoneNumber, gender, roleId } = this.state;

        if (!email || !password || !firstName || !lastName || !address || !phoneNumber || !gender) {
            this.setState({ registerError: 'Please fill in all fields.' });
            return;
        }

        try {
            const response = await createNewUserServices({
                email,
                password,
                firstName,
                lastName,
                address,
                phoneNumber,
                gender,
                roleId
            });

            if (response && response.errCode === 0) {
                this.setState({
                    successMessage: 'User registered successfully!',
                    registerError: '',
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    address: '',
                    phoneNumber: '',
                    gender: '',
                    role: 'customer'
                });
            } else {
                this.setState({ registerError: response.message || 'Registration failed.' });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            this.setState({ registerError: 'An error occurred. Please try again later.' });
        }
    };

    handleLogin = () => {
        const { history } = this.props;
        history.push("/login");
      };

    render() {
        const { email, password, firstName, lastName, address, phoneNumber, gender, registerError, successMessage } = this.state;

        return (
            <>
                <Roles />
                <div className="register-wrapper">
                    <div className="register-container">
                        <h2 className="title">
                            <FormattedMessage id="register.title" defaultMessage="Register" />
                        </h2>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={this.handleInputChange}
                                className="form-control"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={this.handleInputChange}
                                className="form-control"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={firstName}
                                onChange={this.handleInputChange}
                                className="form-control"
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={lastName}
                                onChange={this.handleInputChange}
                                className="form-control"
                                placeholder="Enter your last name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={address}
                                onChange={this.handleInputChange}
                                className="form-control"
                                placeholder="Enter your address"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={phoneNumber}
                                onChange={this.handleInputChange}
                                className="form-control"
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={gender}
                                onChange={this.handleInputChange}
                                className="form-control"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        {registerError && (
                            <div className="register-error">
                                <span>{registerError}</span>
                            </div>
                        )}
                        {successMessage && (
                            <div className="register-success">
                                <span>{successMessage}</span>
                            </div>
                        )}
                        <div className="form-group d-flex">
                            <button className="btn-register" onClick={this.handleRegister}>
                                <FormattedMessage id="register.button" defaultMessage="Register" />
                            </button>
                            <button className="btn-back" onClick={this.handleLogin}>
                                <FormattedMessage id="register.back" defaultMessage="Back" />
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Register;