import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { DoughnutChart } from '../components/DoughnutChart';
import { LineChart } from '../components/LineChart';
import { Card, Carousel, Col, Row, Space, Statistic } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import PortfolioService from '../services/PortfolioService';

const Statistics: React.FC = () => {
    const navigate = useNavigate();

    const [totalValue, setTotalValue] = useState<number>(0);
    const [change, setChange] = useState<number>(0);
    
    const getData = () => {
      PortfolioService.getPortfolio().then((res) => {
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
            <Card bordered={false}>
              <Statistic
                title="Total value"
                value={totalValue}
                precision={2}
                suffix="€"
              />
            </Card>
          </Col>
          <div style={{width: 15}}></div>
          <Col span={4}>
            <Card bordered={false}>
              <Statistic
                title="Day change"
                value={change}
                precision={2}
                valueStyle={{ color: change >= 0 ? 'green' : 'red' }}
                prefix={change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
        <Row justify="center">
          <div style={{height: "580px", width: "700px"}}>
            <Carousel dots={true} dotPosition={'bottom'} effect={'fade'}>
              <DoughnutChart />
              <LineChart />
            </Carousel>
          </div>
        </Row>
      </Space>
    );
}

export default Statistics;