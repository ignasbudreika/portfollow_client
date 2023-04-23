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
    const [selectedPortfolio, setSelectedPortfolio] = useState<PublicPortfolio>();
    const [selectedPortfolioStats, setSelectedPortfolioStats] = useState<PublicPortfolioStats>();

    const [existsMore, setExistsMore] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const [portfolios, setPortfolios] = useState<PublicPortfolio[]>([]);

    interface PublicPortfolio {
        id: string;
        title: string;
        description: string;
        history: DateValue[];
        comments: Comment[];
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

    interface Comment {
        id: string;
        author: string;
        comment: string;
        deletable: boolean;
    }

    const getData = () => {
        PublicPortfolioService.getPublicPortfolios(index).then((res) => {
            setPortfolios(res.data.portfolios.map((portfolio: any) => {
                return {
                    id: portfolio.id,
                    title: portfolio.title,
                    description: portfolio.description,
                    history: portfolio.history.map((history: any) => { return { x: history.date, y: history.value } })
                }
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

    const getPortfolio = (id: string) => {
        PublicPortfolioService.getPublicPortfolio(id).then((res) => {
            setSelectedPortfolio({
                id: res.data.id,
                title: res.data.title,
                description: res.data.description,
                history: res.data.history.map((history: any) => { return { x: history.date, y: history.value } })
            } as PublicPortfolio)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
        });
    }

    console.log(selectedPortfolio?.id);

    const getComments = (id: string) => {
        PublicPortfolioService.getComments(id).then((res) => {
            setSelectedPortfolio((prev) => prev ? ({ ...prev, comments: res.data }) : undefined)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
        });
    }

    const openPublicPortfolio = (id: string) => {
        getPortfolio(id);
        getComments(id);
        PublicPortfolioService.getPublicPortfolioStats(id).then((res) => {
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

        const query = new URLSearchParams(window.location.search.substring(1));
        console.log(query);
        const id = query.get('id');
        console.log(id);
        if (id && id.length > 0) {
            openPublicPortfolio(id);
        }
    }, []);

    return (
        <Space direction="vertical" size="middle" style={{ display: "flex", padding: "0 0 20px 0" }}>
            <Row justify={'center'}>
                <Col xl={16} xs={22} sm={22}>
                    <Typography>
                        <Title level={2}>Public portfolios</Title>
                        <Divider></Divider>
                    </Typography>
                </Col>
            </Row>
            <Row justify={'center'}>
                <Col xl={16} xs={22} sm={22}>
                    <Row justify={'start'} gutter={20}>
                        {
                            portfolios.map(function (portfolio) {
                                return <Col xxl={8} md={12} xs={24} sm={24}>
                                    <Card title=
                                        {
                                            <a onClick={() => openPublicPortfolio(portfolio.id)} style={{ color: "#c7c4c5" }}>
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
                selectedPortfolio && selectedPortfolioStats
                && <PublicPortfolio getComments={() => getComments(selectedPortfolio.id)} portfolio={selectedPortfolio} stats={selectedPortfolioStats} />
            }
        </Space >
    );
}

export default Explore;