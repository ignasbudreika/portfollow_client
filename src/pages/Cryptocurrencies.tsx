import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Button, Col, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import CryptocurrenciesService from '../services/CryptocurrenciesService';
import { useAtom } from 'jotai';
import { showAddCryptoModalAtom } from '../atoms';
import { PlusOutlined } from '@ant-design/icons';
import AddCrypto from '../components/AddCrypto';

const Cryptocurrencies: React.FC = () => {
    const navigate = useNavigate();

    const [, setShowModal] = useAtom(showAddCryptoModalAtom)
    const [cryptocurrencies, setCryptocurrencies] = useState<DataType[]>([]);

    interface DataType {
        id: string
        symbol: string;
        quantity: number;
        price: number;
        value: number;
        date: Date;
      }
      
      const columns: ColumnsType<DataType> = [
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
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
          },
      ];
    
    const getData = () => {
        CryptocurrenciesService.getCrypto().then((res) => {
          if (res.status === 401) {
            navigate("/")
            return;
          }
          setCryptocurrencies(res.data.map((crypto: any) => { 
              return {id: crypto.id, symbol: crypto.symbol, quantity: crypto.quantity, price: crypto.price, value: crypto.value, date: crypto.date} 
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
            <Table columns={columns} dataSource={cryptocurrencies} size="small"></Table>
          </Col>
        </Row>
        <AddCrypto></AddCrypto>
      </Space>
    );
}

export default Cryptocurrencies;