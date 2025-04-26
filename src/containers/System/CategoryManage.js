import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllCategories, updateCategory, createCategory, deleteCategory } from '../../services/categoryService';
import { Table, Input, Button, Modal, Form} from 'antd';
import Header from "../Roles/Roles";
import { FormattedMessage } from "react-intl";
import DashboardSidebar from './Dashboard';

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
            { title: <FormattedMessage id="category.name" />, dataIndex: 'name', key: 'name' },
            { title: <FormattedMessage id="category.description" />, dataIndex: 'description', key: 'description' },
            { title: <FormattedMessage id="category.actions" />, key: 'actions', render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => this.handleEdit(record)}><FormattedMessage id="category.edit" /></Button>
                    <Button danger onClick={() => this.handleDelete(record.id)} style={{ marginLeft: 10 }}><FormattedMessage id="category.delete" /></Button>
                </>
            ) }
        ];

        return (
            <>
                <Header/>
                <DashboardSidebar />
                <div className="container" style={{ marginTop: "120px", marginLeft: "300px" }}>
                    <h2 className="text-center"><FormattedMessage id="category.title" /></h2>
                    <Button type="primary" onClick={this.handleAddNew} className="mb-3"><FormattedMessage id="category.add" /></Button>
                    <Input 
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={this.handleSearch}
                        className="mb-3"
                    />
                    <Table dataSource={filteredCategories} columns={columns} rowKey="id" />

                    <Modal
                        title={isEditMode ? <FormattedMessage id="category.edit" /> : <FormattedMessage id="category.add" />}
                        visible={isModalVisible}
                        onCancel={this.handleModalCancel}
                        footer={null}
                    >
                        <Form key={selectedCategory ? selectedCategory.id : "new-product"} ref={this.formRef} onFinish={this.handleModalOk} initialValues={ selectedCategory || {}}>
                            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter category name' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="description" label="Description">
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">{isEditMode ? <FormattedMessage id="category.save" /> : <FormattedMessage id="category.create" />}</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </>
        );
    }
}

export default connect(null, null)(CategoryManage);
