import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Button, Col, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import CryptocurrenciesService from '../services/CryptocurrenciesService';
import { useAtom } from 'jotai';
import { selectedInvestmentIdAtom, showAddCryptoModalAtom, showAddTxModalAtom } from '../atoms';
import { PlusOutlined } from '@ant-design/icons';
import AddCrypto from '../components/AddCrypto';
import AddTx from '../components/AddTx';

const Cryptocurrencies: React.FC = () => {
    const navigate = useNavigate();

    const [, setShowModal] = useAtom(showAddCryptoModalAtom)
    const [, setShowTxModal] = useAtom(showAddTxModalAtom)
    const [, setSelectedInvestmentId] = useAtom(selectedInvestmentIdAtom)

    const [cryptocurrencies, setCryptocurrencies] = useState<CryptoInvestment[]>([]);

    const addTx = (id: string) => {
      setSelectedInvestmentId(id);
      setShowTxModal(true);
    }

    interface CryptoInvestment {
        id: string
        symbol: string;
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
          title: 'Action',
          key: 'tx',
          render: (_, record) => (
            <Button type="primary" shape="circle" size='small' icon={<PlusOutlined />} onClick={() => addTx(record.id)}></Button>
          ),
        },
      ];
    
    const getData = () => {
        CryptocurrenciesService.getCrypto().then((res) => {
          if (res.status === 401) {
            navigate("/")
            return;
          }
          setCryptocurrencies(res.data.map((crypto: any) => { 
              return {id: crypto.id, symbol: crypto.symbol, quantity: crypto.quantity, price: crypto.price, value: crypto.value, transactions: crypto.transactions} 
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
            <Table columns={columns} dataSource={cryptocurrencies} size="small" pagination={false}
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
        <AddCrypto/>
        <AddTx/>
      </Space>
    );
}

export default Cryptocurrencies;