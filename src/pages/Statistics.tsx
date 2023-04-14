import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { PortfolioValueChart } from '../components/PortfolioValueChart';
import { Card, Col, Row, Space, Statistic, Tooltip } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, InfoCircleOutlined } from '@ant-design/icons';
import PortfolioService from '../services/PortfolioService';
import EmptyPortfolio from '../components/EmptyPortfolio';
import { PortfolioDistributionChart } from '../components/PortfolioDistributionChart';
import { PortfolioProfitLossChart } from '../components/PortfolioProfitLossChart';
import { PortfolioPerformanceChart } from '../components/PortfolioPerformanceChart';
import { logout, useAppDispatch } from '../app/store';

const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
                <Card title={
                  <Space>
                    Total value history
                    <Tooltip placement="right" title={
                      "displays total portfolio value at specific date. " +
                      "Prices for investments are calculated according to previous day's closing price"
                    }>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }>
                  <PortfolioValueChart />
                </Card>
              </Col>
            </Row >
            <Row justify="center">
              <Col xl={16} xs={22} sm={22}>
                <Card title={
                  <Space>
                    P/L history
                    <Tooltip placement="right" title={
                      "displays portfolio profit/loss value at specific date. " +
                      "Is adjusted according to selected time period starting value. " +
                      "Is calculated by a sum of each investments (Current value + total sell value - total purchase value)"
                    }>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }>
                  <PortfolioProfitLossChart />
                </Card>
              </Col>
            </Row >
            <Row justify="center">
              <Col xl={16} xs={22} sm={22}>
                <Card title={
                  <Space>
                    Performance history
                    <Tooltip placement="right" title={
                      "displays portfolio performance since the begining of selected period. " +
                      "Is calculated by a sum of each investments (Current value + total sell value - total purchase value) divided by total purchase value. " +
                      "Is compared with a SPY index for better performance insights."
                    }>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }>
                  <PortfolioPerformanceChart />
                </Card>
              </Col>
            </Row >
          </Space >
      }
    </>
  );
}

export default Statistics;