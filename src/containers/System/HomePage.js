import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllUsers, createNewUserServices, deleteUserServices } from '../../services/userService';
import { Table, Input, Button, Modal, Form } from 'antd';
// import Header from '../../components/Header';
import Header from "../Roles/Header";
class HomePage extends Component {
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
                // Update user logic here
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
            { title: 'Username', dataIndex: 'firstName', key: 'firstName' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'Role', dataIndex: 'roleId', key: 'roleId' },
            { title: 'Actions', key: 'actions', render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => this.handleEdit(record)}>Edit</Button>
                    <Button danger onClick={() => this.handleDelete(record.id)} style={{ marginLeft: 10 }}>Delete</Button>
                </>
            ) }
        ];

        return (
            <>
                <Header toggleCart={this.toggleCartView} />
                <div className="container mt-4">
                    <h2 className="text-center">HomePage</h2>
                    <Button type="primary" onClick={this.handleAddNew} className="mb-3">Add New</Button>
                    <Input 
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={this.handleSearch}
                        className="mb-3"
                    />
                    <Table dataSource={filteredUsers} columns={columns} rowKey="id" />

                    <Modal
                        title={isEditMode ? "Edit User" : "Add New User"}
                        visible={isModalVisible}
                        onCancel={this.handleModalCancel}
                        footer={null}
                    >
                        <Form onFinish={this.handleModalOk} initialValues={selectedUser || {}}>
                            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please enter first name' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">{isEditMode ? "Save Changes" : "Create"}</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);