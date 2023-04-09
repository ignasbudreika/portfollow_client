
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Button, Col, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import StocksService from '../services/StocksService';
import AddStock from '../components/AddStock';
import { PlusOutlined } from '@ant-design/icons';
import {useAtom} from 'jotai'
import { showAddStockModalAtom } from '../atoms';

const Stocks: React.FC = () => {
    const navigate = useNavigate();

    const [, setShowModal] = useAtom(showAddStockModalAtom)

    const [stocks, setStocks] = useState<DataType[]>([]);

    interface DataType {
        id: string
        ticker: string;
        quantity: number;
        price: number;
        value: number;
        date: Date;
      }
      
      const columns: ColumnsType<DataType> = [
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
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
          },
      ];
    
    const getData = () => {
        StocksService.getStocks().then((res) => {
          if (res.status === 401) {
            navigate("/")
            return;
          }
          setStocks(res.data.map((stock: any) => { 
              return {id: stock.id, ticker: stock.ticker, quantity: stock.quantity, price: stock.price, value: stock.value, date: stock.date} 
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
            <Table columns={columns} dataSource={stocks} size="small" pagination={false}></Table>
          </Col>
        </Row>
        <AddStock></AddStock>
      </Space>
    );
}

export default Stocks;