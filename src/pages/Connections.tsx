import { DeleteOutlined, SyncOutlined, UserAddOutlined, WalletOutlined } from "@ant-design/icons";
import { Space, Row, Col, Card, Divider, Badge, Button, Descriptions, Popconfirm, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useAtom } from "jotai";
import { showAddEthereumWalletConnectionModalAtom, showAddSpectrocoinConnectionModalAtom, showAddAlpacaConnectionModalAtom } from '../atoms';
import AddSpectrocoinConnection from "../components/AddSpectrocoinConnection";
import AddEthereumWalletConnection from '../components/AddEthereumWalletConnection';
import ConnectionsService from "../services/ConnectionsService";
import { logout, useAppDispatch } from "../app/store";
import Paragraph from "antd/es/typography/Paragraph";
import AddAlpacaConnection from "../components/AddAlpacaConnection";

const Connections: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [spectrocoinConnected, setSpectrocoinConnected] = useState<boolean>(false);
    const [spectrocoinConnection, setSpectrocoinConnection] = useState<any>();
    const [ethereumWalletConnected, setEthereumWalletConnected] = useState<boolean>(false);
    const [ethereumWalletConnection, setEthereumWalletConnection] = useState<any>();
    const [alpacaConnected, setAlpacaConnected] = useState<boolean>(false);
    const [alpacaConnection, setAlpacaConnection] = useState<any>();

    const [, setShowSpectroinConnectionModal] = useAtom(showAddSpectrocoinConnectionModalAtom)
    const [, setShowEthereumWalletConnectionModal] = useAtom(showAddEthereumWalletConnectionModalAtom)
    const [, setShowAlpacaConnectionModal] = useAtom(showAddAlpacaConnectionModalAtom)

    const getData = () => {
        ConnectionsService.getConnections().then((res) => {
            setSpectrocoinConnected(res.data.spectrocoin.status === 'ACTIVE');
            setSpectrocoinConnection({ clientId: res.data.spectrocoin.client_id, updatedAt: res.data.spectrocoin.updated_at });
            setEthereumWalletConnected(res.data.ethereum.status === 'ACTIVE');
            setEthereumWalletConnection({ address: res.data.ethereum.address, updatedAt: res.data.ethereum.updated_at });
            setAlpacaConnected(res.data.alpaca.status === 'ACTIVE');
            setAlpacaConnection({ apiKey: res.data.alpaca.api_key, updatedAt: res.data.alpaca.updated_at });
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
        });
    };

    const fetchSpectrocoinConnection = () => {
        ConnectionsService.fetchSpectrocoinConnection().then(() => {
            success('SpectroCoin connection was successfully fetched');
            getData();
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
            error('Unable to fetch SpectroCoin connection');
            getData();
        });
    }

    const deleteSpectrocoinConnection = () => {
        ConnectionsService.deleteSpectrocoinConnection().then(() => {
            success('SpectroCoin connection was successfully deleted');
            getData();
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
            error('Unable to delete SpectroCoin connection');
            getData();
        });
    }

    const fetchEthereumWalletConnection = () => {
        ConnectionsService.fetchEthereumWalletConnection().then(() => {
            success('Ethereum wallet connection was successfully fetched');
            getData();
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate("/")
                return;
            }
            error('Unable to fetch Ethereum wallet connection');
            getData();
        });
    }

    const deleteEthereumWalletConnection = () => {
        ConnectionsService.deleteEthereumWalletConnection().then(() => {
            success('Ethereum wallet connection was successfully deleted');
            getData();
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate("/")
                return;
            }
            error('Unable to delete Ethereum wallet connection');
            getData();
        });
    }

    const fetchAlpacaConnection = () => {
        ConnectionsService.fetchAlpacaConnection().then(() => {
            success('Alpaca connection was successfully fetched');
            getData();
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
            error('Unable to fetch Alpaca connection');
            getData();
        });
    }

    const deleteAlpacaConnection = () => {
        ConnectionsService.deleteAlpacaConnection().then(() => {
            success('Alpaca connection was successfully deleted');
            getData();
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
            error('Unable to delete Alpaca connection');
            getData();
        });
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
                <Col xl={14} xs={22} sm={22}>
                    <Typography>
                        <Divider></Divider>
                    </Typography>
                </Col>
            </Row>
            <Row justify="center">
                <Col xl={14} xs={22} sm={22}>
                    <Card style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}
                        cover={
                            <img alt="alpaca markets logo" src="alpaca_logo.jpg" style={{ height: '100px', width: '300px', padding: '20px 0px 0px 0px' }} />
                        }>
                        <Divider orientation="left">Alpaca markets</Divider>
                        <Typography>
                            <Paragraph>
                                Alpaca is a smart trading platform designed for developers, investors, and traders.
                                The company has designed its platform for financial markets in the United States and is a registered securities broker.
                            </Paragraph>
                        </Typography>
                        {
                            alpacaConnected ?
                                <>
                                    <Divider orientation="right"><Badge color="green" text="Connected" /></Divider>
                                    <Descriptions bordered>
                                        <Descriptions.Item label="API key" span={3}>
                                            {
                                                <Typography style={{ color: "#1f1f1f", fontWeight: 'bold' }}>
                                                    {alpacaConnection.apiKey}
                                                </Typography>
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Updated at" span={3}>{alpacaConnection.updatedAt}</Descriptions.Item>
                                    </Descriptions>
                                    <br></br>
                                    <Row justify={'center'}>
                                        <Col span={10}>
                                            <Button block type="primary" icon={<SyncOutlined />} onClick={() => fetchAlpacaConnection()}></Button>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={10}>
                                            <Popconfirm
                                                title="Remove the connection"
                                                description="Are you sure to remove this connection? Imported transactions will remain in the portfolio"
                                                onConfirm={() => deleteAlpacaConnection()}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button block type="primary" icon={<DeleteOutlined />}></Button>
                                            </Popconfirm>
                                        </Col>
                                    </Row>
                                </>
                                :
                                <>
                                    <Divider orientation="left"><Badge color="red" text="Not connected" /></Divider>
                                    <Button block type="primary" icon={<UserAddOutlined />} onClick={() => setShowAlpacaConnectionModal(true)}></Button>
                                </>
                        }
                        <AddAlpacaConnection refresh={getData} />
                    </Card>
                </Col>
            </Row>
            <Row justify="center">
                <Col xl={14} xs={22} sm={22}>
                    <Card cover={<img alt="spectrocoin logo" src="spectrocoin_logo.svg" style={{ height: '100px', padding: '20px 0px 0px 0px' }} />}>
                        <Divider orientation="left">SpectroCoin</Divider>
                        <Typography>
                            <Paragraph>
                                SpectroCoin is an all-in-one solution for cryptocurrencies.
                                Their services include a wide selection of cryptocurrency solutions, ranging from exchange to e-wallets.
                            </Paragraph>
                        </Typography>
                        {
                            spectrocoinConnected ?
                                <>
                                    <Divider orientation="right"><Badge color="green" text="Connected" /></Divider>
                                    <Descriptions bordered>
                                        <Descriptions.Item label="Client ID" span={3}>
                                            <Typography style={{ color: "#1f1f1f", fontWeight: 'bold' }}>
                                                {spectrocoinConnection.clientId}
                                            </Typography>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Updated at" span={3}>{spectrocoinConnection.updatedAt}</Descriptions.Item>
                                    </Descriptions>
                                    <br></br>
                                    <Row justify={'center'}>
                                        <Col span={10}>
                                            <Button block type="primary" icon={<SyncOutlined />} onClick={() => fetchSpectrocoinConnection()}></Button>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={10}>
                                            <Popconfirm
                                                title="Remove the connection"
                                                description="Are you sure to remove this connection? Imported transactions will remain in the portfolio"
                                                onConfirm={() => deleteSpectrocoinConnection()}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button block type="primary" icon={<DeleteOutlined />}></Button>
                                            </Popconfirm>
                                        </Col>
                                    </Row>
                                </>
                                :
                                <>
                                    <Divider orientation="left"><Badge color="red" text="Not connected" /></Divider>
                                    <Button block type="primary" icon={<UserAddOutlined />} onClick={() => setShowSpectroinConnectionModal(true)}></Button>
                                </>
                        }
                        <AddSpectrocoinConnection refresh={getData} />
                    </Card>
                </Col>
            </Row >
            <Row justify="center">
                <Col xl={14} xs={22} sm={22}>
                    <Card cover={<img alt="ethereum logo" src="ethereum_logo.svg" style={{ height: '100px', padding: '20px 0px 0px 0px' }} />}>
                        <Divider orientation="left">Ethereum wallet</Divider>
                        <Typography>
                            <Paragraph>
                                Ethereum wallets are applications that let you interact with your Ethereum account.
                                Think of it like an internet banking app - without the bank.
                                Your wallet lets you read your balance, send transactions and connect to applications.
                            </Paragraph>
                        </Typography>
                        {
                            ethereumWalletConnected ?
                                <>
                                    <Divider orientation="right"><Badge color="green" text="Connected" /></Divider>
                                    <Descriptions bordered>
                                        <Descriptions.Item label="Address" span={3}>
                                            {
                                                <a href={"https://etherscan.io/address/" + ethereumWalletConnection.address} target="_blank" style={{ color: "#1f1f1f", fontWeight: 'bold' }}>
                                                    {ethereumWalletConnection.address}
                                                </a>
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Updated at" span={3}>{ethereumWalletConnection.updatedAt}</Descriptions.Item>
                                    </Descriptions>
                                    <br></br>
                                    <Row justify={'center'}>
                                        <Col span={10}>
                                            <Button block type="primary" icon={<SyncOutlined />} onClick={() => fetchEthereumWalletConnection()}></Button>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={10}>
                                            <Popconfirm
                                                title="Remove the connection"
                                                description="Are you sure to remove this connection? Imported transactions will remain in the portfolio"
                                                onConfirm={() => deleteEthereumWalletConnection()}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button block type="primary" icon={<DeleteOutlined />}></Button>
                                            </Popconfirm>
                                        </Col>
                                    </Row>
                                </>
                                :
                                <>
                                    <Divider orientation="left"><Badge color="red" text="Not connected" /></Divider>
                                    <Button block type="primary" icon={<WalletOutlined />} onClick={() => setShowEthereumWalletConnectionModal(true)}></Button>
                                </>
                        }
                        <AddEthereumWalletConnection refresh={getData} />
                    </Card>
                </Col>
            </Row>
        </Space >
    );
}

export default Connections;