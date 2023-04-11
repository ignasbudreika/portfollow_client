
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Button, Col, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import StocksService from '../services/StocksService';
import AddStock from '../components/AddStock';
import { PlusOutlined } from '@ant-design/icons';
import {useAtom} from 'jotai'
import { selectedInvestmentIdAtom, showAddStockModalAtom, showAddTxModalAtom } from '../atoms';
import AddTx from '../components/AddTx';

const Stocks: React.FC = () => {
    const navigate = useNavigate();

    const [, setShowModal] = useAtom(showAddStockModalAtom)
    const [, setShowTxModal] = useAtom(showAddTxModalAtom)
    const [, setSelectedInvestmentId] = useAtom(selectedInvestmentIdAtom)

    const [stocks, setStocks] = useState<StockInvestment[]>([]);

    const addTx = (id: string) => {
      setSelectedInvestmentId(id);
      setShowTxModal(true);
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
          title: 'Action',
          key: 'tx',
          render: (_, record) => (
            <Button type="primary" shape="circle" size='small' icon={<PlusOutlined />} onClick={() => addTx(record.id)}></Button>
          ),
        },
      ];
    
    const getData = () => {
        StocksService.getStocks().then((res) => {
          if (res.status === 401) {
            navigate("/")
            return;
          }
          setStocks(res.data.map((stock: any) => { 
              return {id: stock.id, ticker: stock.ticker, quantity: stock.quantity, price: stock.price, value: stock.value, transactions: stock.transactions} 
          }));
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
        <Row justify="end">
          <Col span={8}>
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setShowModal(true)}></Button>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={10}>
            <Table columns={columns} dataSource={stocks} size="small" pagination={false} 
            expandable={{
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
                ];
                return (
                  <Table<Transaction>
                    columns={transactions}
                    dataSource={record.transactions}
                    pagination={false}
                  />
                );
              },
            }}></Table>
          </Col>
        </Row>
        <AddStock></AddStock>
        <AddTx/>
      </Space>
    );
}

export default Stocks;