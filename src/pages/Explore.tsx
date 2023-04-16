import { Button, Card, Col, Divider, Row, Space } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import Typography from "antd/es/typography/Typography";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import PublicPortfolioService from "../services/PublicPortfolioService";
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";
import { PublicPortfolioHistoryChart } from "../components/PublicPortfolioHistoryChart";
import { useAtom } from "jotai";
import { showPublicPortfolioDrawerAtom } from "../atoms";
import PublicPortfolio from "../components/PublicPortfolio";

const Explore: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [, setOpen] = useAtom(showPublicPortfolioDrawerAtom);
    const [selectedPortfolio, setSelectedPortfolio] = useState<PublicPortfolio>({} as PublicPortfolio);
    const [selectedPortfolioStats, setSelectedPortfolioStats] = useState<PublicPortfolioStats>({} as PublicPortfolioStats);

    const [existsMore, setExistsMore] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const [portfolios, setPortfolios] = useState<PublicPortfolio[]>([]);

    interface PublicPortfolio {
        id: string;
        title: string;
        description: string;
        history: DateValue[];
    }

    interface PublicPortfolioStats {
        trend: number;
        change: number;
        hidden: boolean;
        categories: string[];
        distribution: number[];
    }

    interface DateValue {
        date: string;
        value: number;
    }

    const getData = () => {
        PublicPortfolioService.getPublicPortfolios(index).then((res) => {
            setPortfolios(res.data.portfolios.map((portfolio: any) => {
                return { id: portfolio.id, title: portfolio.title, description: portfolio.description, history: portfolio.history.map((history: any) => { return { x: history.date, y: history.value } }) }
            }));
            setIndex(res.data.index);
            setExistsMore(res.data.more);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
        });
    };

    const loadMore = () => {
        PublicPortfolioService.getPublicPortfolios(index).then((res) => {
            setPortfolios(portfolios.concat(res.data.portfolios.map((portfolio: any) => {
                return {
                    id: portfolio.id,
                    title: portfolio.title,
                    description: portfolio.description,
                    history: portfolio.history.map((history: any) => {
                        return {
                            x: history.date,
                            y: history.value
                        }
                    })
                }
            })));
            setIndex(res.data.index);
            setExistsMore(res.data.more);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
        });
    }

    const openPublicPortfolio = (portfolio: PublicPortfolio) => {
        setSelectedPortfolio(portfolio);
        PublicPortfolioService.getPublicPortfolioStats(portfolio.id).then((res) => {
            setSelectedPortfolioStats({
                trend: res.data.trend,
                change: res.data.total_change,
                hidden: res.data.hidden_value,
                distribution: res.data.hidden_value ?
                    res.data.distribution.map((distribution: any) => distribution.percentage) :
                    res.data.distribution.map((distribution: any) => distribution.value),
                categories: res.data.distribution.map((distribution: any) => distribution.label)
            } as PublicPortfolioStats);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
        });
        setOpen(true);
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
            <Row justify={'center'}>
                <Col xl={16} xs={22} sm={22}>
                    <Typography>
                        <Title level={2}>Public portfolios</Title>
                        <Divider></Divider>
                        <Paragraph>
                            Portfollow allows users to publish their investment portfolios,
                            providing a valuable resource for investors to explore and learn from others' investment strategies.
                        </Paragraph>
                        <Paragraph>
                            By exploring published portfolios, users can gain insights into different investment approaches,
                            discover new investment opportunities, and improve their own investment performance.
                        </Paragraph>
                        <Paragraph>
                            By leveraging the collective knowledge of our user community, we provide investors with a powerful
                            tool for staying up-to-date with the latest trends in the investment world.
                        </Paragraph>
                    </Typography>
                </Col>
            </Row>
            <Row justify={'center'}>
                <Col xl={16} xs={22} sm={22}>
                    <Row justify={'start'}>
                        {
                            portfolios.map(function (portfolio) {
                                return <Col xxl={8} md={12} xs={24} sm={20}>
                                    <Card title=
                                        {
                                            <a onClick={() => openPublicPortfolio(portfolio)} style={{ color: "#c7c4c5" }}>
                                                {portfolio.title}
                                            </a>
                                        }
                                        bodyStyle={{ justifyContent: 'center', padding: 0 }}>
                                        <PublicPortfolioHistoryChart values={portfolio.history} />
                                    </Card>
                                </Col>
                            })
                        }
                    </Row>
                </Col>
            </Row >
            <Row justify={'center'}>
                <Button icon={<AppstoreAddOutlined />} hidden={!existsMore} onClick={loadMore}>More</Button>
            </Row>
            {
                selectedPortfolio && selectedPortfolioStats && <PublicPortfolio portfolio={selectedPortfolio} stats={selectedPortfolioStats} />
            }
        </Space >
    );
}

export default Explore;