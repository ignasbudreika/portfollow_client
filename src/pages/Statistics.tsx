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
import { logout, selectAuth, useAppDispatch, useAppSelector } from '../app/store';

const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  const [empty, setEmpty] = useState<boolean>(true);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalValueChange, setTotalValueChange] = useState<number>(0);
  const [trend, setTrend] = useState<number>(0);

  const getData = () => {
    PortfolioService.getPortfolio().then((res) => {
      setEmpty(res.data.is_empty);
      setTotalValue(res.data.total_value);
      setTotalValueChange(res.data.total_change);
      setTrend(res.data.trend);
    }).catch((err) => {
      if (err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
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
              <Col xl={5} xs={16} sm={10} md={7}>
                <Card>
                  <Statistic
                    title="Total value"
                    value={totalValue}
                    precision={2}
                    suffix="$"
                  />
                </Card>
              </Col>
              <Col xl={5} xs={16} sm={10} md={7}>
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
              <Col xl={5} xs={16} sm={10} md={7}>
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
              </Col>
            </Row>
            <Row justify="center">
              <Col xl={8} xs={16} sm={12}>
                <Card title={'Portfolio distribution'}>
                  <PortfolioDistributionChart />
                </Card>
              </Col>
            </Row>
            <Row justify="center">
              <Col xl={16} xs={22} sm={22}>
                <Card title={'Total value history'}>
                  <PortfolioValueChart />
                </Card>
              </Col>
            </Row>
            <Row justify="center">
              <Col xl={16} xs={22} sm={22}>
                <Card title={'P/L history'}>
                  <PortfolioProfitLossChart />
                </Card>
              </Col>
            </Row>
            <Row justify="center">
              <Col xl={16} xs={22} sm={22}>
                <Card title={'Performance history'}>
                  <PortfolioPerformanceChart />
                </Card>
              </Col>
            </Row>
          </Space >
      }
    </>
  );
}

export default Statistics;