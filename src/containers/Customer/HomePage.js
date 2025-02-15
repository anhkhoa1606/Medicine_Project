import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllUsers, createNewUserServices, deleteUserServices } from '../../services/userService';
import { getAllProducts, createProduct, deleteProduct, updateProduct } from '../../services/productService';
import { Table, Input, Button, Modal, Form } from 'antd';

class HomePage extends Component {
    state = {
        products: [],
        searchTerm: '',
        isModalVisible: false,
        isEditMode: false,
        selectedProduct: null,
    };

    componentDidMount() {
        this.fetchProducts();
    }

    fetchProducts = async () => {
        try {
            let response = await getAllProducts();
            if (response.errCode === 0) {
                this.setState({ products: response.data });
            }
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    handleSearch = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    handleAddNew = () => {
        this.setState({ isModalVisible: true, isEditMode: false, selectedProduct: null });
    };

    handleEdit = (product) => {
        this.setState({ isModalVisible: true, isEditMode: true, selectedProduct: product });
    };

    handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            this.fetchProducts();
        } catch (error) {
            console.error("Error deleting product", error);
        }
    };

    handleModalCancel = () => {
        this.setState({ isModalVisible: false, selectedProduct: null });
    };

    handleModalOk = async (values) => {
        try {
            if (this.state.isEditMode) {
                await updateProduct(values);
            } else {
                await createProduct(values);
            }
            this.setState({ isModalVisible: false });
            this.fetchProducts();
        } catch (error) {
            console.error("Error saving product", error);
        }
    };

    render() {
        const { products, searchTerm, isModalVisible, isEditMode, selectedProduct } = this.state;
        const filteredProducts = products.filter(product =>
            (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Price', dataIndex: 'price', key: 'price' },
            { title: 'Stock', dataIndex: 'stock', key: 'stock' },
            { title: 'Actions', key: 'actions', render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => this.handleEdit(record)}>Edit</Button>
                    <Button danger onClick={() => this.handleDelete(record.id)} style={{ marginLeft: 10 }}>Delete</Button>
                </>
            ) }
        ];

        return (
            <div className="container mt-4">
                <h2 className="text-center">HOME PAGE</h2>
                <Button type="primary" onClick={this.handleAddNew} className="mb-3">Add New</Button>
                <Input 
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={this.handleSearch}
                    className="mb-3"
                />
                <Table dataSource={filteredProducts} columns={columns} rowKey="id" />

                <Modal
                    title={isEditMode ? "Edit Product" : "Add New Product"}
                    visible={isModalVisible}
                    onCancel={this.handleModalCancel}
                    footer={null}
                >
                    <Form onFinish={this.handleModalOk} initialValues={selectedProduct || {}}>
                        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter product name' }]}>                            <Input />
                        </Form.Item>
                        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter product price' }]}>                            <Input />
                        </Form.Item>
                        <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please enter stock quantity' }]}>                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">{isEditMode ? "Save Changes" : "Create"}</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
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
