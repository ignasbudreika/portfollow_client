
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Col, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import StocksService from '../services/StocksService';

const Stocks: React.FC = () => {
    const navigate = useNavigate();

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
        <Row justify="center">
          <Col span={10}>
            <Table columns={columns} dataSource={stocks}></Table>
          </Col>
        </Row>
      </Space>
    );
}

export default Stocks;