import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Button, Card, Col, Divider, Popconfirm, Row, Space, Statistic, Table, Tooltip, Typography, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAtom } from 'jotai';
import { selectedInvestmentIdAtom, showAddCryptoModalAtom, showAddTxModalAtom } from '../Atoms';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FieldTimeOutlined, InfoCircleOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';
import AddCrypto from '../components/AddCurrency';
import AddTx from '../components/AddTx';
import TransactionService from '../services/TransactionService';
import InvestmentService from '../services/InvestmentService';
import { logout, useAppDispatch } from '../app/Store';
import Title from 'antd/es/typography/Title';
import CurrenciesService from '../services/CurrenciesService';

const Currencies: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [, setShowModal] = useAtom(showAddCryptoModalAtom)
  const [, setShowTxModal] = useAtom(showAddTxModalAtom)
  const [, setSelectedInvestmentId] = useAtom(selectedInvestmentIdAtom)

  const [createPeriodic, setCreatePeriodic] = useState<boolean>(false);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalValueChange, setTotalValueChange] = useState<number>(0);
  const [trend, setTrend] = useState<number>(0);

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoInvestment[]>([]);

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  const addTx = (id: string) => {
    setSelectedInvestmentId(id);
    setShowTxModal(true);
  }

  const stopPeriodicInvestments = (id: string) => {
    InvestmentService.stopPeriodicInvestments(id).then(() => {
      success('Future periodic investments were successfully stopped');
      getData();
    }).catch((err) => {
      if (err.response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }
      error('Unable to stop periodic investments');
    })
  }

  const removeInvestment = (id: string) => {
    InvestmentService.deleteInvestment(id).then(() => {
      success('Investment was successfully deleted');
      getData();
    }).catch((err) => {
      if (err.response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }
      error('Unable to delete investment');
    })
  }

  const removeTx = (id: string) => {
    TransactionService.deleteTransaction(id).then(() => {
      success('Transaction was successfully deleted');
      getData();
    }).catch((err) => {
      if (err.response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      error('Unable to delete transaction');
    })
  }

  interface CryptoInvestment {
    id: string
    symbol: string;
    quantity: number;
    price: number;
    value: number;
    type: string;
    updateType: string;
    dayTrend: number;
    totalChange: number;
    transactions: Transaction[];
  }

  interface Transaction {
    id: string
    quantity: number;
    type: string;
    date: Date;
  }

  const columns: ColumnsType<CryptoInvestment> = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price, $',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Value, $',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Day trend, %',
      dataIndex: 'dayTrend',
      key: 'day_trend',
      render: (_, investment) => (
        <div style={{ color: investment.dayTrend >= 0 ? 'green' : 'red' }}>{investment.dayTrend}</div>
      ),
    },
    {
      title: 'Total change, $',
      dataIndex: 'totalChange',
      key: 'total_change',
      render: (_, investment) => (
        <div style={{ color: investment.totalChange >= 0 ? 'green' : 'red' }}>{investment.totalChange}</div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Update type',
      dataIndex: 'updateType',
      key: 'updateType',
    },
    {
      title: 'Action',
      key: 'tx',
      render: (_, investment) => (
        <Space>
          <Button
            disabled={
              investment.updateType == 'SpectroCoin account' || investment.updateType == 'Ethereum wallet'
            }
            type="primary" shape="circle" size='small' icon={<PlusOutlined />} onClick={() => addTx(investment.id)}>
          </Button>
          <Popconfirm
            title="Delete the investment"
            description="Are you sure to delete this investment? This affects all of the portfolio statistics"
            onConfirm={() => removeInvestment(investment.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" shape="circle" size='small' icon={<DeleteOutlined />}></Button>
          </Popconfirm>
          <Popconfirm
            title="Stop periodic investments"
            description="Are you sure to stop periodic investments for this investment?"
            onConfirm={() => stopPeriodicInvestments(investment.id)}
            disabled={investment.updateType == 'Manual' || investment.updateType == 'SpectroCoin account' || investment.updateType == 'Ethereum wallet'}
            okText="Yes"
            cancelText="No"
          >
            <Button
              disabled={investment.updateType == 'Manual' || investment.updateType == 'SpectroCoin account' || investment.updateType == 'Ethereum wallet'}
              type="primary"
              shape="circle" size='small'
              icon={<StopOutlined />}>
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getData = () => {
    CurrenciesService.getCurrencies().then((res) => {
      setCryptocurrencies(res.data.map((currency: any) => {
        return {
          id: currency.id,
          symbol: currency.symbol,
          quantity: currency.quantity,
          price: currency.price,
          value: currency.value,
          type: currency.crypto ? 'Crypto' : 'Fiat',
          updateType: currency.update_type,
          dayTrend: currency.day_trend,
          totalChange: currency.total_change,
          transactions: currency.transactions
        }
      }));
    }).catch((err) => {
      if (err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
    });

    CurrenciesService.getCurrenciesStats().then((res) => {
      setTotalValue(res.data.total_value);
      setTrend(res.data.trend);
      setTotalValueChange(res.data.total_change);
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
    <Space direction="vertical" size="middle" style={{ display: "flex", padding: "0 0 20px 0" }}>
      {contextHolder}
      <Row justify={'center'}>
        <Col xl={16} xs={22} sm={22}>
          <Typography>
            <Title level={2}>Manage currency investments</Title>
            <Divider></Divider>
          </Typography>
        </Col>
      </Row>
      <Row justify="center">
        <Col xl={5} xs={16} sm={10} md={7}>
          <Card>
            <Statistic
              title={
                <Space>
                  Total currencies value
                  <Tooltip placement="right" title={
                    "current currency holdings value"
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
                    "current currency holdings value change compared to previous days closing price"
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
                    "total change of currency investments value for full portfolio history"
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
      <Row justify="end">
        <Col span={8}>
          <Space>
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => { setCreatePeriodic(false); setShowModal(true) }}></Button>
            <Button type="primary" shape="circle" icon={<FieldTimeOutlined />} onClick={() => { setCreatePeriodic(true); setShowModal(true) }}></Button>
          </Space>
        </Col>
      </Row>
      <Row justify="center">
        <Col xl={16} xs={22} sm={22}>
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={cryptocurrencies}
            size="small"
            pagination={false}
            scroll={{ x: "max-content" }}
            expandable={{
              expandedRowKeys: expandedKeys,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedKeys((prev) => [...prev, record.id])
                } else {
                  setExpandedKeys((prev) => prev.filter((k) => k !== record.id));
                }
              },
              expandedRowRender: (record) => {
                const transactions: ColumnsType<Transaction> = [
                  {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    key: 'quantity',
                  },
                  {
                    title: 'Type',
                    dataIndex: 'type',
                    key: 'type',
                  },
                  {
                    title: 'Date',
                    dataIndex: 'date',
                    key: 'date',
                  },
                  {
                    title: '',
                    key: 'action',
                    render: (_, tx) => (
                      <Popconfirm
                        title="Delete the transaction"
                        description="Are you sure to delete this transaction? This affects all of the portfolio statistics"
                        onConfirm={() => removeTx(tx.id)}
                        okText="Yes"
                        disabled={record.updateType != 'Manual'}
                        cancelText="No"
                      >
                        <Button disabled={
                          record.updateType == 'SpectroCoin account' || record.updateType == 'Ethereum wallet'
                        } type="primary" shape="circle" size='small' icon={<DeleteOutlined />}></Button>
                      </Popconfirm>
                    ),
                  },
                ];
                return (
                  <Table<Transaction>
                    rowKey={(record) => record.id}
                    columns={transactions}
                    dataSource={record.transactions}
                    pagination={false}
                  />
                );
              },
            }}></Table>
        </Col>
      </Row>
      <AddCrypto periodic={createPeriodic} onDone={getData} />
      <AddTx onDone={getData} />
    </Space>
  );
}

export default Currencies;