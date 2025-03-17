import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllUsers, createNewUserServices, deleteUserServices, editUserServices } from '../../services/userService';
import { Table, Input, Button, Modal, Form, Select } from 'antd';
import ChatBoxAdmin from "./ChatBoxAdmin";
import Header from "../Roles/Roles";
import { FormattedMessage } from "react-intl";

class UserManage extends Component {
    state = {
        users: [],
        searchTerm: '',
        isModalVisible: false,
        isEditMode: false,
        selectedUser: null,
    };

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers = async () => {
        try {
            let response = await getAllUsers();
            if (response.errCode === 0) {
                this.setState({ users: response.data });
            }
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    handleSearch = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    handleAddNew = () => {
        this.setState({ isModalVisible: true, isEditMode: false, selectedUser: null });
    };

    handleEdit = (user) => {
        this.setState({ isModalVisible: true, isEditMode: true, selectedUser: user });
    };

    handleDelete = async (userId) => {
        try {
            await deleteUserServices(userId);
            this.fetchUsers();
        } catch (error) {
            console.error("Error deleting user", error);
        }
    };

    handleModalCancel = () => {
        this.setState({ isModalVisible: false, selectedUser: null });
    };

    handleModalOk = async (values) => {
        try {
            if (this.state.isEditMode) {
                const updatedUser = { ...values, id: this.state.selectedUser.id }; 
                await editUserServices(updatedUser);
            } else {
                await createNewUserServices(values);
            }
            this.setState({ isModalVisible: false });
            this.fetchUsers();
        } catch (error) {
            console.error("Error saving user", error);
        }
    };

    render() {
        const { users, searchTerm, isModalVisible, isEditMode, selectedUser } = this.state;
        const filteredUsers = users.filter(user =>
            (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const columns = [
            { title: <FormattedMessage id="users.username" />, dataIndex: 'firstName', key: 'firstName' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: <FormattedMessage id="users.role" />, dataIndex: 'roleId', key: 'roleId' },
            { title: <FormattedMessage id="users.actions" />, key: 'actions', render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => this.handleEdit(record)}><FormattedMessage id="users.edit" /></Button>
                    <Button danger onClick={() => this.handleDelete(record.id)} style={{ marginLeft: 10 }}><FormattedMessage id="users.delete" /></Button>
                </>
            ) }
        ];

        return (
            <>
                <ChatBoxAdmin />
                <Header/>
                <div className="container" style={{ marginTop: "120px" }}>
                    <h2 className="text-center"><FormattedMessage id="users.title" /></h2>
                    <Button type="primary" onClick={this.handleAddNew} className="mb-3"><FormattedMessage id="users.add" /></Button>
                    <Input 
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={this.handleSearch}
                        className="mb-3"
                    />
                    <Table dataSource={filteredUsers} columns={columns} rowKey="id" />

                    <Modal
                        title={isEditMode ? <FormattedMessage id="users.edit" /> : <FormattedMessage id="users.add" />}
                        visible={isModalVisible}
                        onCancel={this.handleModalCancel}
                        footer={null}
                    >
                        <Form key={selectedUser ? selectedUser.id : "new-user"} onFinish={this.handleModalOk} initialValues={selectedUser || { roleId: "admin", gender: true }}>
                            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
                                <Input />
                            </Form.Item>

                            {!isEditMode && (
                                <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter password' }]}>
                                    <Input.Password />
                                </Form.Item>
                            )}

                            <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please enter first name' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please enter last name' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="address" label="Address">
                                <Input />
                            </Form.Item>

                            <Form.Item name="phoneNumber" label="Phone Number">
                                <Input />
                            </Form.Item>

                            <Form.Item name="gender" label="Gender">
                                <Select>
                                    <Select.Option value={true}>Male</Select.Option>
                                    <Select.Option value={false}>Female</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="roleId" label="Role ID" rules={[{ required: true, message: 'Please select a role' }]}>
                                <Select>
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="staff">Staff</Select.Option>
                                    <Select.Option value="customer">Customer</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">{isEditMode ? <FormattedMessage id="users.save" /> : <FormattedMessage id="users.create" />}</Button>
                            </Form.Item>
                        </Form>

                    </Modal>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);