import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { DoughnutChart } from '../components/DoughnutChart';
import { LineChart } from '../components/LineChart';
import { Card, Col, Row, Space, Statistic } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import PortfolioService from '../services/PortfolioService';

const Statistics: React.FC = () => {
    const navigate = useNavigate();

    const [totalValue, setTotalValue] = useState<number>(0);
    const [totalValueChange, setTotalValueChange] = useState<number>(0);
    const [change, setChange] = useState<number>(0);
    
    const getData = () => {
      PortfolioService.getPortfolio().then((res) => {
        if (res.status === 401) {
          navigate("/")
          return;
        }
        setTotalValue(res.data.total_value);
        setChange(res.data.change);
      });
    };

    useEffect(() => {
      if (!localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY)) {
          navigate("/")
          return;
      }

      getData();
    }, []);

    return (
      <Space direction="vertical" size="middle" style={{ display: "flex", padding: "0 0 20px 0" }}>
        <Row justify="center">
          <Col span={4}>
            <Card>
              <Statistic
                title="Total value"
                value={totalValue}
                precision={2}
                suffix="$"
              />
            </Card>
            <Card>
              <Statistic
                title="Total value change"
                value={change}
                precision={2}
                valueStyle={{ color: change >= 0 ? 'green' : 'red' }}
                prefix={totalValueChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="$"
              />
            </Card>
            <Card>
              <Statistic
                title="Trend"
                value={change}
                precision={2}
                valueStyle={{ color: change >= 0 ? 'green' : 'red' }}
                prefix={change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={7}>
          <Card>
            <DoughnutChart />
          </Card>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={11}>
            <Card>
              <LineChart />
            </Card>
          </Col>
        </Row>
      </Space>
    );
}

export default Statistics;