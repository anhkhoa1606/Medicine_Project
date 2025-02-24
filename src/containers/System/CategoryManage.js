import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllCategories, updateCategory, createCategory, deleteCategory } from '../../services/categoryService';
import { Table, Input, Button, Modal, Form} from 'antd';
import Header from "../Roles/Header";

class CategoryManage extends Component {
    state = {
        categories: [],
        searchTerm: '',
        isModalVisible: false,
        isEditMode: false,
        selectedCategory: {},
    };
    formRef = React.createRef();

    componentDidMount() {
        this.fetchCategories();
    }

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
        this.setState({ isModalVisible: true, isEditMode: false, selectedCategory: {} }, () => {
            this.formRef.current?.resetFields();
        });
    };

    handleEdit = (category) => {
        this.setState({ 
            isModalVisible: true, 
            isEditMode: true, 
            selectedCategory: category 
        }, () => {
            this.formRef.current?.setFieldsValue(category);
        });
    };
    
    handleDelete = async (categoryId) => {
        try {
            await deleteCategory(categoryId);
            this.fetchCategories();
        } catch (error) {
            console.error("Error deleting category", error);
        }
    };

    handleModalCancel = () => {
        this.setState({ isModalVisible: false, selectedCategory: {} });
    };

    handleModalOk = async (values) => {
        try {
            const { isEditMode, selectedCategory } = this.state;
            const categoryData = { 
                ...selectedCategory,
                ...values,
                image: selectedCategory?.image || values.image || ""
            };
            console.log("categoryData", categoryData);

            if (isEditMode) {
                categoryData.id = selectedCategory.id;
                await updateCategory(categoryData);
            } else {
                await createCategory(categoryData);
            }

            this.setState({ isModalVisible: false });
            this.fetchCategories();
        } catch (error) {
            console.error("Error saving category", error);
        }
    };

    render() {
        const { categories, searchTerm, isModalVisible, isEditMode, selectedCategory } = this.state;
        const filteredCategories = categories.filter(category =>
            category.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Description', dataIndex: 'description', key: 'description' },
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
                    <h2 className="text-center">Manage Categories</h2>
                    <Button type="primary" onClick={this.handleAddNew} className="mb-3">Add New</Button>
                    <Input 
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={this.handleSearch}
                        className="mb-3"
                    />
                    <Table dataSource={filteredCategories} columns={columns} rowKey="id" />

                    <Modal
                        title={isEditMode ? "Edit Category" : "Add New Category"}
                        visible={isModalVisible}
                        onCancel={this.handleModalCancel}
                        footer={null}
                    >
                        <Form ref={this.formRef} onFinish={this.handleModalOk} initialValues={ selectedCategory || {}}>
                            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter category name' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="description" label="Description">
                                <Input.TextArea />
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

export default connect(null, null)(CategoryManage);
