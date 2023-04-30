import { Card, Col, Row, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react'
import { Header } from 'antd/es/layout/layout';
import Paragraph from 'antd/es/typography/Paragraph';

export const LandingPage: React.FC = () => {
    return (
        <Row justify="center" style={{ height: "calc(100vh - 64px)" }}>
            <Col xs={20} sm={20} md={18} lg={18} xl={18} xxl={18} >
                <Row justify="center" style={{ height: "calc(70vh - 64px)" }} gutter={40}>
                    <Col xs={20} sm={20} md={18} lg={16} xl={19} xxl={19}>
                        <Title>WELCOME TO portfollow</Title>
                    </Col>
                    <Col xs={20} sm={20} md={18} lg={16} xl={6} xxl={6}>
                        <Card
                            style={{
                                margin: "0 0 30px 0",
                                borderRadius: "20px",
                                overflow: "hidden"
                            }}
                            cover={<img alt="Track Your investments" src="landing_page.jpg" />}
                        >
                            <Title level={4}>TRACK YOUR INVESTMENTS</Title>
                            <Paragraph>
                                Hold Your stock, crypto and fiat currencies investments data in one place.
                                <br></br>
                                Stay up to date with the recent data of your portfolio holdings.
                                <br></br>
                                Get updated statistics that allow to better determine Your current portfolio success.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={20} sm={20} md={18} lg={16} xl={6} xxl={6}>
                        <Card
                            style={{
                                margin: "0 0 30px 0",
                                borderRadius: "20px",
                                overflow: "hidden"
                            }}
                            cover={<img alt="Connect Your accounts" src="landing_page.jpg" />}
                        >
                            <Title level={4}>CONNECT YOUR ACCOUNTS</Title>
                            <Paragraph>
                                Connect your brokerage accounts to synchronize the investments.
                                <br></br>
                                Automatically get updated positions from the connected brokerages.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={20} sm={20} md={18} lg={16} xl={6} xxl={6}>
                        <Card
                            style={{
                                margin: "0 0 30px 0",
                                borderRadius: "20px",
                                overflow: "hidden"
                            }}
                            cover={<img alt="Share and explore" src="landing_page.jpg" />}
                        >
                            <Title level={4}>SHARE AND EXPLORE</Title>
                            <Paragraph>
                                Share your portfolio with other users and receive feedback.
                                <br></br>
                                Explore the entire public portfolio gallery.
                                <br></br>
                                Get new ideas and inspiration from others success and failures.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row >
            </Col >
        </Row >
    );
}