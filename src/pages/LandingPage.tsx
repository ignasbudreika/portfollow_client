import Icon from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Image, Row, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react'

export const LandingPage: React.FC = () => {
    return (
        <Row justify="center">
            < Col xs={22} sm={22} md={20} lg={20} xl={18} xxl={18} >
                <Row justify="center" gutter={50}>
                    <Col xs={20} sm={20} md={18} lg={16} xl={19} xxl={19}>
                        <Typography>
                            <Divider></Divider>
                        </Typography>
                    </Col>
                    <Col xs={20} sm={20} md={18} lg={16} xl={8} xxl={8}>
                        <Card
                            style={{
                                margin: "0 0 30px 0",
                                borderRadius: "20px",
                                overflow: "hidden"
                            }}
                            cover={<img alt="Track Your investments" src="track5.svg" />}
                        >
                            <Title level={4} style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                TRACK INVESTMENTS
                            </Title>
                        </Card>
                        <Card
                            style={{
                                margin: "0 0 30px 0",
                                borderRadius: "20px",
                                overflow: "hidden"
                            }}
                            cover={<img alt="Get asset data" src="assets.svg" />}
                        >
                            <Title level={4} style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                GET UP TO DATE FINANCIAL DATA
                            </Title>
                        </Card>
                    </Col>
                    <Col xs={20} sm={20} md={18} lg={16} xl={8} xxl={8}>
                        <Card
                            style={{
                                margin: "0 0 30px 0",
                                borderRadius: "20px",
                                overflow: "hidden"
                            }}
                        >
                            <Title level={4} style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                PORTFOLLOW
                            </Title>
                            <Typography>
                                <Typography.Paragraph style={{ textAlign: 'center', textSizeAdjust: 'auto', fontSize: 15 }}>
                                    Investment tracking made simple. Welcome to Portfollow,
                                    your partner in tracking and managing your portfolio with ease and accuracy
                                </Typography.Paragraph>
                            </Typography>
                        </Card>
                        <Card
                            style={{
                                margin: "0 0 30px 0",
                                borderRadius: "20px",
                                overflow: "hidden"
                            }}
                            cover={<img alt="Share and explore" src="periodic.svg" />}
                        >
                            <Title level={4} style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                CREATE PERIODIC INVESTMENTS
                            </Title>
                        </Card>
                    </Col>
                    <Col xs={20} sm={20} md={18} lg={16} xl={8} xxl={8}>
                        <Card
                            style={{
                                margin: "0 0 30px 0",
                                borderRadius: "20px",
                                overflow: "hidden"
                            }}
                            cover={<img alt="Connect Your accounts" src="wallet.svg" />}
                        >
                            <Title level={4} style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                CONNECT ACCOUNTS
                            </Title>
                        </Card>
                        <Card
                            style={{
                                margin: "0 0 30px 0",
                                borderRadius: "20px",
                                overflow: "hidden"
                            }}
                            cover={<img alt="Share and explore" src="share.svg" />}
                        >
                            <Title level={4} style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                SHARE AND EXPLORE
                            </Title>
                        </Card>
                    </Col>
                </Row >
            </Col >
        </Row >
    );
}