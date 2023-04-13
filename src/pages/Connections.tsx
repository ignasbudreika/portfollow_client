import { SyncOutlined, UserAddOutlined, WalletOutlined } from "@ant-design/icons";
import { Space, Row, Col, Card, Skeleton, Divider, Badge, Button, Descriptions } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useAtom } from "jotai";
import { showAddEthereumWalletConnectionModalAtom, showAddSpectrocoinConnectionModalAtom } from "../atoms";
import AddSpectrocoinConnection from "../components/AddSpectrocoinConnection";
import AddEthereumWalletConnection from '../components/AddEthereumWalletConnection';
import ConnectionsService from "../services/ConnectionsService";
import { logout, useAppDispatch } from "../app/store";

const Connections: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [spectrocoinConnected, setSpectrocoinConnected] = useState<boolean>(false);
    const [spectrocoinConnection, setSpectrocoinConnection] = useState<any>();
    const [ethereumWalletConnected, setEthereumWalletConnected] = useState<boolean>(false);
    const [ethereumWalletConnection, setEthereumWalletConnection] = useState<any>();

    const [, setShowSpectroinConnectionModal] = useAtom(showAddSpectrocoinConnectionModalAtom)
    const [, setShowEthereumWalletConnectionModal] = useAtom(showAddEthereumWalletConnectionModalAtom)

    const getData = () => {
        ConnectionsService.getConnections().then((res) => {
            setSpectrocoinConnected(res.data.spectrocoin.status === 'ACTIVE');
            setSpectrocoinConnection({ clientId: res.data.spectrocoin.client_id, updatedAt: res.data.spectrocoin.updated_at });
            setEthereumWalletConnected(res.data.ethereum.status === 'ACTIVE');
            setEthereumWalletConnection({ address: res.data.ethereum.address, updatedAt: res.data.ethereum.updated_at });
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
        });
    };

    const fetchSpectrocoinConnection = () => {
        ConnectionsService.fetchSpectrocoinConnection().catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
        });
    }

    const fetchEthereumWalletConnection = () => {
        ConnectionsService.fetchEthereumWalletConnection().then((res) => {
            if (res.status === 401) {
                navigate("/")
                return;
            }
        });
    }

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
                <Col xl={12} xs={22} sm={22}>
                    <Card cover={<img alt="example" src="spectrocoin_logo.svg" style={{ height: '100px', padding: '20px 0px 0px 0px' }} />}>
                        <Divider orientation="left">SpectroCoin</Divider>
                        <p>
                            SpectroCoin is an all-in-one solution for cryptocurrencies.
                            It has been serving the needs of blockchain enthusiasts ever since the dawn of cryptocurrencies.
                            Their services include a wide selection of cryptocurrency solutions, ranging from exchange to e-wallets.
                        </p>
                        {
                            spectrocoinConnected ?
                                <>
                                    <Divider orientation="right"><Badge color="green" text="Connected" /></Divider>
                                    <Descriptions bordered>
                                        <Descriptions.Item label="Client ID" span={3}>{spectrocoinConnection.clientId}</Descriptions.Item>
                                        <Descriptions.Item label="Updated at" span={3}>{spectrocoinConnection.updatedAt}</Descriptions.Item>
                                    </Descriptions>
                                    <br></br>
                                    <Button block type="primary" icon={<SyncOutlined />} onClick={() => fetchSpectrocoinConnection()}></Button>
                                </>
                                :
                                <>
                                    <Divider orientation="left"><Badge color="red" text="Not connected" /></Divider>
                                    <Button block type="primary" icon={<UserAddOutlined />} onClick={() => setShowSpectroinConnectionModal(true)}></Button>
                                </>
                        }
                        <AddSpectrocoinConnection></AddSpectrocoinConnection>
                    </Card>
                </Col>
            </Row>
            <Row justify="center">
                <Col xl={12} xs={22} sm={22}>
                    <Card cover={<img alt="example" src="ethereum_logo.svg" style={{ height: '100px', padding: '20px 0px 0px 0px' }} />}>
                        <Divider orientation="left">Ethereum wallet</Divider>
                        <p>
                            Ethereum wallets are applications that let you interact with your Ethereum account.
                            Think of it like an internet banking app - without the bank.
                            Your wallet lets you read your balance, send transactions and connect to applications.
                        </p>
                        {
                            ethereumWalletConnected ?
                                <>
                                    <Divider orientation="right"><Badge color="green" text="Connected" /></Divider>
                                    <Descriptions bordered>
                                        <Descriptions.Item label="Address" span={3}>{ethereumWalletConnection.address}</Descriptions.Item>
                                        <Descriptions.Item label="Updated at" span={3}>{ethereumWalletConnection.updatedAt}</Descriptions.Item>
                                    </Descriptions>
                                    <br></br>
                                    <Button block type="primary" icon={<SyncOutlined />} onClick={() => fetchEthereumWalletConnection()}></Button>
                                </>
                                :
                                <>
                                    <Divider orientation="left"><Badge color="red" text="Not connected" /></Divider>
                                    <Button block type="primary" icon={<WalletOutlined />} onClick={() => setShowEthereumWalletConnectionModal(true)}></Button>
                                </>
                        }
                        <AddEthereumWalletConnection></AddEthereumWalletConnection>
                    </Card>
                </Col>
            </Row>
            <Row justify="center">
                <Col xl={12} xs={22} sm={22}>
                    <Card><Skeleton /></Card>
                </Col>
            </Row>
        </Space>
    );
}

export default Connections;