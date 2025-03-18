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
import { getRevenue } from "../../services/orderService";
import Header from "../Customer/Header";
import "./Rechart.scss";
import DashboardSidebar from "./Dashboard";
import { FormattedMessage } from "react-intl";

class Rechart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchRevenueData();
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

  render() {
    const { data, loading, error } = this.state;

    return (
      <>
        <Header />
        <DashboardSidebar/>
        <div className="rechart-container">
          <h2 className="rechart-title"><FormattedMessage id="menu.system.system-administrator.revenue" /></h2>

          {loading && <p className="rechart-loading">Đang tải dữ liệu...</p>}
          {error && <p className="rechart-error">{error}</p>}

          {!loading && !error && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* <Footer /> */}
      </>
    );
  }
}

export default Rechart;
