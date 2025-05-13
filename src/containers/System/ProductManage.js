import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllProducts, createProduct, deleteProduct, updateProduct } from '../../services/productService';
import { Table, Input, Button, Modal, Form, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Header from "../Roles/Roles";
import { getAllCategories } from '../../services/categoryService';
import { Option } from 'lucide-react';
import { FormattedMessage } from "react-intl";
import DashboardSidebar from './Dashboard';

class ProductManage extends Component {
    state = {
        products: [],
        searchTerm: '',
        categories: [],
        isModalVisible: false,
        isEditMode: false,
        selectedProduct: {},
        currentPage: 1,           // Trang hiện tại
        totalPages: 1,            // Tổng số trang
        limit: 8,
    };
    formRef = React.createRef();

    componentDidMount() {
        this.fetchProducts(this.state.currentPage);
        this.fetchCategories(); 
    }

    fetchProducts = async (page) => {
        try {
          let response = await getAllProducts(page, this.state.limit);
          if (response.data.errCode === 0) {
            this.setState({
              products: response.data.data,
              totalPages: response.data.pagination.totalPages,
              currentPage: response.data.pagination.currentPage
            });
          }
        } catch (error) {
          console.error("Error fetching products", error);
        }
    };

    fetchCategories = async () => {
        try {
            let response = await getAllCategories();
            if (response.errCode === 0) {
                this.setState({ categories: response.data });
            }
        } catch (error) {
            console.error("Error fetching categories", error);
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
            const response = await fetch("https://api.cloudinary.com/v1_1/dmsggj0vu/image/upload", {
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
        const { products, searchTerm, isModalVisible, isEditMode, selectedProduct, categories } = this.state;
        const filteredProducts = products.filter(product =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const columns = [
            { title: <FormattedMessage id="products.name" />, dataIndex: 'name', key: 'name' },
            { title: <FormattedMessage id="products.price" />, dataIndex: 'price', key: 'price' },
            { title: <FormattedMessage id="products.stock" />, dataIndex: 'stock', key: 'stock' },
            { title: <FormattedMessage id="products.image" />, dataIndex: 'image', key: 'image', render: image => image && <img src={image} alt="product" style={{ width: 50 }} /> },
            { title: <FormattedMessage id="products.category" />, dataIndex: 'categoryId', key: 'categoryId', 
                render: categoryId => {
                    const category = categories.find(cat => cat.id === categoryId);
                    return category ? category.name : "Unknown";
                }
            },
            { title: <FormattedMessage id="products.actions" />, key: 'actions', render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => this.handleEdit(record)}><FormattedMessage id="products.edit" /></Button>
                    <Button danger onClick={() => this.handleDelete(record.id)} style={{ marginLeft: 10 }}><FormattedMessage id="products.delete" /></Button>
                </>
            ) }
        ];

        return (
            <>
                <Header/>
                <DashboardSidebar />
                <div className="container" style={{ marginTop: "120px", marginLeft: "300px" }}>
                    <h2 className="text-center"><FormattedMessage id="products.title" /></h2>
                    <Button type="primary" onClick={this.handleAddNew} className="mb-3"><FormattedMessage id="products.add" /></Button>
                    <Input 
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={this.handleSearch}
                        className="mb-3"
                    />
                    <Table 
                        dataSource={filteredProducts} 
                        columns={columns} 
                        rowKey="id" 
                        pagination={{
                            current: this.state.currentPage,
                            total: this.state.totalPages * this.state.limit,
                            pageSize: this.state.limit,
                            onChange: (page) => this.fetchProducts(page),
                        }} 
                    />

                    <Modal
                        title={isEditMode ? <FormattedMessage id="products.edit" /> : <FormattedMessage id="products.add" />}
                        visible={isModalVisible}
                        onCancel={this.handleModalCancel}
                        footer={null}
                    >
                        <Form key={selectedProduct ? selectedProduct.id : "new-product"} ref={this.formRef} onFinish={this.handleModalOk} initialValues={ selectedProduct || {}}>
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
                            <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select a category' }]}>
                                <Select placeholder="Select a category">
                                    {categories.map(category => (
                                        <Option key={category.id} value={category.id}>{category.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Image">
                                <Upload beforeUpload={() => false} onChange={this.handleImageUpload} showUploadList={false}>
                                    <Button icon={<UploadOutlined />}><FormattedMessage id="products.upload" /></Button>
                                </Upload>
                                {this.state.selectedProduct?.image && <img src={this.state.selectedProduct.image} alt="Product" style={{ width: 100, marginTop: 10 }} />}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">{isEditMode ? <FormattedMessage id="products.save" /> : <FormattedMessage id="products.create" />}</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </>
        );
    }
}

export default connect(null, null)(ProductManage);
