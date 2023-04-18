
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Button, Card, Col, Divider, Popconfirm, Row, Space, Statistic, Table, Tooltip, Typography, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import StocksService from '../services/StocksService';
import AddStock from '../components/AddStock';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FieldTimeOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai'
import { selectedInvestmentIdAtom, showAddStockModalAtom, showAddTxModalAtom } from '../atoms';
import AddTx from '../components/AddTx';
import InvestmentService from '../services/InvestmentService';
import TransactionService from '../services/TransactionService';
import { logout, useAppDispatch } from '../app/store';
import Title from 'antd/es/typography/Title';

const Stocks: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [, setShowModal] = useAtom(showAddStockModalAtom)
  const [, setShowTxModal] = useAtom(showAddTxModalAtom)
  const [, setSelectedInvestmentId] = useAtom(selectedInvestmentIdAtom)

  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalValueChange, setTotalValueChange] = useState<number>(0);
  const [trend, setTrend] = useState<number>(0);

  const [stocks, setStocks] = useState<StockInvestment[]>([]);

  const addTx = (id: string) => {
    setSelectedInvestmentId(id);
    setShowTxModal(true);
  }

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

  interface StockInvestment {
    id: string
    ticker: string;
    quantity: number;
    price: number;
    value: number;
    transactions: Transaction[];
  }

  interface Transaction {
    id: string
    quantity: number;
    type: string;
    date: Date;
  }

  const columns: ColumnsType<StockInvestment> = [
    {
      title: 'Ticker',
      dataIndex: 'ticker',
      key: 'ticker',
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
      title: '',
      key: 'action',
      render: (_, investment) => (
        <Space>
          <Button type="primary" shape="circle" size='small' icon={<PlusOutlined />} onClick={() => addTx(investment.id)}></Button>
          <Popconfirm
            title="Delete the investment"
            description="Are you sure to delete this investment? This affects all of the portfolio statistics"
            onConfirm={() => removeInvestment(investment.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" shape="circle" size='small' icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getData = () => {
    StocksService.getStocks().then((res) => {
      setStocks(res.data.map((stock: any) => {
        return { id: stock.id, ticker: stock.ticker, quantity: stock.quantity, price: stock.price, value: stock.value, transactions: stock.transactions }
      }));

    }).catch((err) => {
      if (err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
    });

    StocksService.getStocksStats().then((res) => {
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
            <Title level={2}>Manage stock investments</Title>
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
                  Total stocks value
                  <Tooltip placement="right" title={
                    "current stocks holdings value"
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
                    "current stocks holdings value change compared to previous days closing price"
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
                    "total change of stocks investments value for full portfolio history"
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
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setShowModal(true)}></Button>
            <Button type="primary" shape="circle" icon={<FieldTimeOutlined />} onClick={() => setShowModal(true)}></Button>
          </Space>
        </Col>
      </Row>
      <Row justify="center">
        <Col xl={16} xs={22} sm={22}>
          <Table columns={columns} dataSource={stocks} size="small" pagination={false}
            expandable={{
              expandedRowRender: (investment) => {
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
                        cancelText="No"
                      >
                        <Button type="primary" shape="circle" size='small' icon={<DeleteOutlined />}></Button>
                      </Popconfirm>
                    ),
                  },
                ];
                return (
                  <Table<Transaction>
                    columns={transactions}
                    dataSource={investment.transactions}
                    pagination={false}
                  />
                );
              },
            }}></Table>
        </Col>
      </Row>
      <AddStock onDone={getData}></AddStock>
      <AddTx onDone={getData} />
    </Space>
  );
}

export default Stocks;