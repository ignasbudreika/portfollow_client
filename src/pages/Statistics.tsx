import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { PortfolioValueChart } from '../components/PortfolioValueChart';
import { Card, Col, Row, Space, Statistic, Switch, Tooltip } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, InfoCircleOutlined } from '@ant-design/icons';
import PortfolioService from '../services/PortfolioService';
import EmptyPortfolio from '../components/EmptyPortfolio';
import PortfolioDistributionChart from '../components/PortfolioDistributionChart';
import { PortfolioProfitLossChart } from '../components/PortfolioProfitLossChart';
import { PortfolioPerformanceChart } from '../components/PortfolioPerformanceChart';
import { logout, useAppDispatch } from '../app/Store';

const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [empty, setEmpty] = useState<boolean>(true);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalValueChange, setTotalValueChange] = useState<number>(0);
  const [trend, setTrend] = useState<number>(0);
  const [percentage, setPercentage] = useState<boolean>(false);

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
                    title={
                      <Space>
                        Total value
                        <Tooltip placement="right" title={
                          "current portfolio value"
                        }>
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    value={totalValue}
                    precision={2}
                    suffix="$"
                  />
                </Card>
              </Col>
              <Col xl={5} xs={16} sm={10} md={7}>
                <Card>
                  <Statistic
                    title={
                      <Space>
                        Trend
                        <Tooltip placement="right" title={
                          "current investments value change compared to previous days closing price"
                        }>
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
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
                    title={
                      <Space>
                        Total value change
                        <Tooltip placement="right" title={
                          "total change of investments value for full portfolio history"
                        }>
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
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
              <Col xl={5} xs={16} sm={12} md={12} lg={12}>
                <Card title={
                  <Space>
                    Portfolio distribution
                    <Tooltip placement="right" title={
                      "displays current portfolio distribution by category. " +
                      "Upon clicking category, displays distribution of assets from the selected category."
                    }>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }>
                  <>
                    <Switch
                      checkedChildren={"%"}
                      unCheckedChildren={"$"}
                      onChange={value => setPercentage(value)} />
                    <PortfolioDistributionChart percentage={percentage} />
                  </>
                </Card>
              </Col>
            </Row >
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