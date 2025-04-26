import React, { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getRevenue, getTotal, getUserChart } from "../../services/orderService";
import Header from "../Customer/Header";
import "./Rechart.scss";
import Dashboard from './Dashboard';
import { FormattedMessage } from "react-intl";

class Rechart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      totalRevenue: 0,
      totalUsers: 0,
      revenueGrowth: 0,
      userGrowth: 0,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchRevenueData();
    this.fetchTotalData();
  }

  fetchRevenueData = async () => {
    try {
      const response = await getRevenue();
      this.setState({ data: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      this.setState({ error: "Lỗi khi tải dữ liệu", loading: false });
    }
  };

  fetchTotalData = async () => {
    try {
      const totalResponse = await getTotal();
      const userResponse = await getUserChart();

      this.setState({
        totalRevenue: totalResponse.totalRevenue,
        totalUsers: userResponse.totalUniqueUsers,
      });
    } catch (error) {
      console.error("Error fetching total data:", error);
      this.setState({ error: "Lỗi khi tải dữ liệu", loading: false });
    }
  };

  render() {
    const { data, totalRevenue, totalUsers, loading, error } = this.state;

    return (
      <>
        <Header />
        <Dashboard />
        <div className="dashboard-container">
          {/* Hai ô tổng quan */}
          <div className="summary-cards">
            <div className="summary-card">
              <p className="summary-title">Tổng doanh thu | Hôm nay</p>
              <div className="summary-content">
                <span className="summary-icon">💲</span>
                <span className="summary-value">{totalRevenue}</span>
              </div>
            </div>

            <div className="summary-card">
              <p className="summary-title">Khách hàng | Hôm nay</p>
              <div className="summary-content">
                <span className="summary-icon">👥</span>
                <span className="summary-value">{totalUsers}</span>
              </div>
            </div>
          </div>

          {/* Biểu đồ doanh thu */}
          <div className="rechart-container">
            <h2 className="rechart-title"><FormattedMessage id="menu.system.system-administrator.revenue" /></h2>

            {loading && <p className="rechart-loading">Đang tải dữ liệu...</p>}
            {error && <p className="rechart-error">{error}</p>}

            {!loading && !error && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Rechart;
