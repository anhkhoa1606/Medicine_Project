import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getOrderService, deleteOrderService, editOrderService } from '../../services/orderService';
import { Table, Input, Button, Modal, Form } from 'antd';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// import Header from '../../components/Header';
import Header from "../Roles/Header";
class OrderManage extends Component {
    state = {
        orders: [],
        searchTerm: '',
        isModalVisible: false,
        selectedOrder: null,
    };

    componentDidMount() {
        this.fetchOrders();
    }

    fetchOrders = async () => {
        try {
            let response = await getOrderService();
            console.log('response', response);
            if (response.errCode === 0) {
                this.setState({ orders: response.order });
            }
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    handleSearch = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    handleEdit = (order) => {
        this.setState({ isModalVisible: true, selectedOrder: order });
    };

    handleDelete = async (orderId) => {
        try {
            await deleteOrderService(orderId);
            this.fetchOrders();
        } catch (error) {
            console.error("Error deleting order", error);
        }
    };

    handleModalCancel = () => {
        this.setState({ isModalVisible: false, selectedOrder: null });
    };

    handleModalOk = async (values) => {
        try {
            const updatedOrder = { ...values, id: this.state.selectedOrder.id };
            await editOrderService(updatedOrder);
            this.setState({ isModalVisible: false });
            this.fetchOrders();
        } catch (error) {
            console.error("Error updating order", error);
        }
    };

    render() {
        const { orders, searchTerm, isModalVisible, selectedOrder } = this.state;
        console.log('orders:', orders)
        const filteredOrders = orders.filter(order =>
            order.username && order.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const columns = [
            { title: 'Order Name', dataIndex: 'username', key: 'username' },
            { title: 'Total Price', dataIndex: 'totalPrice', key: 'totalPrice' },
            { title: 'Actions', key: 'actions', render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => this.handleEdit(record)}>Edit</Button>
                    <Button danger onClick={() => this.handleDelete(record.id)} style={{ marginLeft: 10 }}>Delete</Button>
                </>
            ) }
        ];

        return (
            <>
                <Header/>
                <div className="container mt-4">
                    <h2 className="text-center">Manage Orders</h2>
                    <Input 
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={this.handleSearch}
                        className="mb-3"
                    />
                    <Table dataSource={filteredOrders} columns={columns} rowKey="id" />

                    <Modal
                        title="Edit Order"
                        visible={isModalVisible}
                        onCancel={this.handleModalCancel}
                        footer={null}
                    >
                        <Form onFinish={this.handleModalOk} initialValues={selectedOrder || {}}>
                            <Form.Item name="name" label="Order Name" rules={[{ required: true, message: 'Please enter order name' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="totalPrice" label="Total Price" rules={[{ required: true, message: 'Please enter total price' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Save Changes</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderManage);
