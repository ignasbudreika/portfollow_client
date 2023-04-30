import { Button, Col, Descriptions, Drawer, List, Statistic, message } from "antd";
import { useAtom } from "jotai";
import { showPublicPortfolioDrawerAtom } from "../Atoms";
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRef, useState } from 'react';
import { Doughnut, getElementAtEvent } from "react-chartjs-2";
import PublicPortfolioService from "../services/PublicPortfolioService";
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/Store";
import TextArea from "antd/es/input/TextArea";

interface Props {
    getComments: () => void;
    portfolio: PublicPortfolio;
    stats: PublicPortfolioStats;
}

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
    categories: string[];
    hidden: boolean;
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

const PublicPortfolio = (props: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useAtom(showPublicPortfolioDrawerAtom);
    const [selectedInvestmentType, setSelectedInvestmentType] = useState<string>('');

    const [newComment, setNewComment] = useState<string>('');

    const [categories, setCategories] = useState<any[]>([]);
    const [values, setValues] = useState<number[]>([]);

    const [comments, setComments] = useState<Comment[]>([]);

    const chartRef = useRef(null);

    const distribution = {
        labels: categories.length > 0 ?
            categories : props.stats.categories,
        datasets: [
            {
                label: props.stats.hidden ?
                    'percentage' : 'invested amount',
                data: values.length > 0 ?
                    values : props.stats.distribution,
                backgroundColor: ["#70a37f", "#659482", "#598485", "#4d7588", "#476d89", "#41658a", "#474f71", "#4c3957"],
            },
        ],
    };

    const deleteComment = (id: string) => {
        PublicPortfolioService.deleteComment(id).then(() => {
            success('Comment was successfully deleted');
            props.getComments();
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
            error('Unable to delete comment');
        });
    }

    const createComment = () => {
        PublicPortfolioService.createComment(props.portfolio.id, { comment: newComment }).then(() => {
            success('Comment was successfully created');
            setNewComment('');
            props.getComments();
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
            error('Unable to create comment');
        });
    }

    const onClose = () => {
        setSelectedInvestmentType('');
        setCategories([]);
        setValues([]);
        setOpen(false);
    }

    const onReturn = () => {
        setSelectedInvestmentType('');
        getData('');
    }

    const onSelectedType = (event: any) => {
        if (chartRef.current) {
            if (categories.length > 0) {
                getData(categories[getElementAtEvent(chartRef.current, event)[0].index]);
            } else {
                getData(props.stats.categories[getElementAtEvent(chartRef.current, event)[0].index]);
            }
        }
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

    const getData = (investmentType: string) => {
        if (investmentType.length == 0) {
            PublicPortfolioService.getPublicPortfolioDistribution(props.portfolio.id).then((res) => {
                if (props.stats.hidden) {
                    setValues(res.data.distribution.map((distribution: any) => distribution.percentage));
                } else {
                    setValues(res.data.distribution.map((distribution: any) => distribution.value));
                }
                setCategories(res.data.distribution.map((distribution: any) => distribution.label));
            }).catch((err) => {
                if (err.response.status === 401) {
                    dispatch(logout());
                    navigate("/");
                }
            });
        } else if (selectedInvestmentType.length == 0) {
            PublicPortfolioService.getPublicPortfolioDistributionByType(props.portfolio.id, investmentType).then((res) => {
                setSelectedInvestmentType(investmentType);
                if (props.stats.hidden) {
                    setValues(res.data.distribution.map((distribution: any) => distribution.percentage));
                } else {
                    setValues(res.data.distribution.map((distribution: any) => distribution.value));
                }
                setCategories(res.data.distribution.map((distribution: any) => distribution.label));
            }).catch((err) => {
                if (err.response.status === 401) {
                    dispatch(logout());
                    navigate("/");
                }
            });
        } else {
            onReturn();
        }
    };

    const onCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
    };

    return (
        <Drawer title={props.portfolio.title} onClose={onClose} open={open}>
            {contextHolder}
            <Descriptions layout="vertical">
                <Descriptions.Item span={3} label="About the portfolio">
                    {props.portfolio.description}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Distribution">
                    {
                        props.stats.distribution && props.stats.distribution.length != 0 ?
                            <Col style={{ width: "300px" }}>
                                <Doughnut ref={chartRef} onClick={onSelectedType} data={distribution} options={
                                    {
                                        maintainAspectRatio: false, responsive: true, aspectRatio: 1, plugins:
                                        {
                                            legend:
                                            {
                                                display: false,
                                            }
                                        }
                                    }
                                } />
                            </Col> :
                            "Portfolio is empty"
                    }
                </Descriptions.Item>
                <Col span={12}>
                    <Statistic
                        title="Trend"
                        value={props.stats.trend}
                        precision={2}
                        valueStyle={{ color: props.stats.trend >= 0 ? 'green' : 'red' }}
                        prefix={props.stats.trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        suffix="%"
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title="Total change"
                        value={props.stats.change}
                        precision={2}
                        valueStyle={{ color: props.stats.change >= 0 ? 'green' : 'red' }}
                        prefix={props.stats.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        suffix={props.stats.hidden ? "%" : "$"}
                    />
                </Col>
                <Descriptions.Item span={3} label="Comments">{ }</Descriptions.Item>
            </Descriptions>
            <List>
                {
                    props.portfolio.comments && props.portfolio.comments.map(function (comment) {
                        return <List.Item
                            actions={
                                comment.deletable ?
                                    [<DeleteOutlined onClick={() => deleteComment(comment.id)} />] : []
                            }
                        >
                            <List.Item.Meta
                                title={comment.author}
                                description={comment.comment}
                            />
                        </List.Item>
                    })
                }
            </List>
            <TextArea
                showCount
                maxLength={40}
                rows={4}
                style={{ resize: 'none' }}
                onChange={onCommentChange}
                value={newComment}
                placeholder="leave a comment"
            />
            <br></br>
            <Button type="primary" disabled={newComment.length <= 0} onClick={createComment}>Comment</Button>
        </Drawer >
    );
}

export default PublicPortfolio;