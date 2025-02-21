import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllProducts, createProduct, deleteProduct, updateProduct } from '../../services/productService';
import { Table, Input, Button, Modal, Form, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Header from "../Roles/Header";

class ProductManage extends Component {
    state = {
        products: [],
        searchTerm: '',
        isModalVisible: false,
        isEditMode: false,
        selectedProduct: {},
    };
    formRef = React.createRef();

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
        this.setState({ isModalVisible: true, isEditMode: false, selectedProduct: {} }, () => {
            this.formRef.current?.resetFields();
        });
    };

    handleEdit = (product) => {
        this.setState({ 
            isModalVisible: true, 
            isEditMode: true, 
            selectedProduct: product 
        }, () => {
            this.formRef.current?.setFieldsValue(product);
        });
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
        this.setState({ isModalVisible: false, selectedProduct: {} });
    };

    handleModalOk = async (values) => {
        try {
            const { isEditMode, selectedProduct } = this.state;
            const productData = { 
                ...selectedProduct,
                ...values,
                image: selectedProduct?.image || values.image || ""
            };
            console.log("productData", productData);

            if (isEditMode) {
                productData.id = selectedProduct.id;
                await updateProduct(productData);
            } else {
                await createProduct(productData);
            }

            this.setState({ isModalVisible: false });
            this.fetchProducts();
        } catch (error) {
            console.error("Error saving product", error);
        }
    };

    handleImageUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "user_avatar");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dyfbye716/image/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.secure_url) {
                this.setState(prevState => ({
                    selectedProduct: { ...prevState.selectedProduct, image: result.secure_url }
                }));
                message.success("Image uploaded successfully");
            } else {
                message.error("Image upload failed");
            }
        } catch (error) {
            console.error("Error uploading image", error);
            message.error("Image upload error");
        }
    };

    render() {
        const { products, searchTerm, isModalVisible, isEditMode, selectedProduct } = this.state;
        const filteredProducts = products.filter(product =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Price', dataIndex: 'price', key: 'price' },
            { title: 'Stock', dataIndex: 'stock', key: 'stock' },
            { title: 'Image', dataIndex: 'image', key: 'image', render: image => image && <img src={image} alt="product" style={{ width: 50 }} /> },
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
                        <Form ref={this.formRef} onFinish={this.handleModalOk} initialValues={ selectedProduct || {}}>
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
                                {this.state.selectedProduct?.image && <img src={this.state.selectedProduct.image} alt="Product" style={{ width: 100, marginTop: 10 }} />}
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

export default connect(null, null)(ProductManage);
