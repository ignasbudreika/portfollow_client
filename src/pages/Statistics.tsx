import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { PortfolioValueChart } from '../components/PortfolioValueChart';
import { Card, Col, Row, Space, Statistic } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import PortfolioService from '../services/PortfolioService';
import EmptyPortfolio from '../components/EmptyPortfolio';
import { PortfolioDistributionChart } from '../components/PortfolioDistributionChart';
import { PortfolioProfitLossChart } from '../components/PortfolioProfitLossChart';
import { PortfolioPerformanceChart } from '../components/PortfolioPerformanceChart';

const Statistics: React.FC = () => {
  const navigate = useNavigate();

  const [empty, setEmpty] = useState<boolean>(true);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalValueChange, setTotalValueChange] = useState<number>(0);
  const [trend, setTrend] = useState<number>(0);

  const getData = () => {
    PortfolioService.getPortfolio().then((res) => {
      if (res.status === 401) {
        navigate("/")
        return;
      }
      setEmpty(res.data.is_empty);
      setTotalValue(res.data.total_value);
      setTotalValueChange(res.data.total_change);
      setTrend(res.data.trend);
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
    <>
      {
        empty ?
          <EmptyPortfolio />
          :
          <Space direction="vertical" size="middle" style={{ display: "flex", padding: "0 0 20px 0" }}>
            <Row justify="center">
              <Col xl={4} xs={16} sm={16}>
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
                    value={totalValueChange}
                    precision={2}
                    valueStyle={{ color: totalValueChange >= 0 ? 'green' : 'red' }}
                    prefix={totalValueChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    suffix="$"
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Trend"
                    value={trend}
                    precision={2}
                    valueStyle={{ color: trend >= 0 ? 'green' : 'red' }}
                    prefix={trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col xl={7} xs={16} sm={16}>
                <Card>
                  <PortfolioDistributionChart />
                </Card>
              </Col>
            </Row>
            <Row justify="center">
              <Col xl={12} xs={22} sm={22}>
                <Card title={'Total value history'}>
                  <PortfolioValueChart />
                </Card>
              </Col>
            </Row>
            <Row justify="center">
              <Col xl={12} xs={22} sm={22}>
                <Card title={'P/L history'}>
                  <PortfolioProfitLossChart />
                </Card>
              </Col>
            </Row>
            <Row justify="center">
              <Col xl={12} xs={22} sm={22}>
                <Card title={'Performance history'}>
                  <PortfolioPerformanceChart />
                </Card>
              </Col>
            </Row>
          </Space>
      }
    </>
  );
}

export default Statistics;