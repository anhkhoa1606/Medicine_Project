import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllProducts, createProduct, deleteProduct, updateProduct } from '../../services/productService';
import { Table, Input, Button, Modal, Form } from 'antd';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

class ProductManage extends Component {
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
                const updatedProduct = { ...values, id: this.state.selectedProduct.id }; 
                await updateProduct(updatedProduct);
            } else {
                await createProduct(values);
            }
            this.setState({ isModalVisible: false });
            this.fetchProducts();
        } catch (error) {
            console.error("Error saving product", error);
        }
    };

    handleImageUpload = ({ file }) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.setState({ selectedProduct: { ...this.state.selectedProduct, image: reader.result } });
        };
        reader.onerror = (error) => {
            message.error('Failed to upload image');
        };
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
                <h2 className="text-center">Manage Products</h2>
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
                        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter product name' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter product price' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please enter stock quantity' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please enter category' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Image">
                            <Upload beforeUpload={() => false} onChange={this.handleImageUpload} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                            {selectedProduct?.image && <img src={selectedProduct.image} alt="Product" style={{ width: 100, marginTop: 10 }} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductManage);
