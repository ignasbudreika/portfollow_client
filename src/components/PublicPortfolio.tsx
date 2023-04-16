import { Col, Descriptions, Drawer, Statistic } from "antd";
import { useAtom } from "jotai";
import { showPublicPortfolioDrawerAtom } from "../atoms";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useRef } from 'react';
import { Doughnut } from "react-chartjs-2";

interface Props {
    portfolio: PublicPortfolio
    stats: PublicPortfolioStats
}

interface PublicPortfolio {
    id: string;
    title: string;
    description: string;
    history: DateValue[];
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

const PublicPortfolio = (props: Props) => {
    const [open, setOpen] = useAtom(showPublicPortfolioDrawerAtom);

    const chartRef = useRef(null);

    const distribution = {
        labels: props.stats.categories,
        datasets: [
            {
                label: props.stats.hidden ?
                    'percentage' : 'invested amount',
                data: props.stats.distribution,
                backgroundColor: ["#70a37f", "#659482", "#598485", "#4d7588", "#476d89", "#41658a", "#474f71", "#4c3957"],
            },
        ],
    };

    return (
        <Drawer title={props.portfolio.title} onClose={() => setOpen(false)} open={open}>
            <Descriptions layout="vertical">
                <Descriptions.Item span={3} label="About the portfolio">
                    {props.portfolio.description}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Distribution">
                    {
                        props.stats.distribution && props.stats.distribution.length != 0 ?
                            <Col style={{ width: "300px" }}>
                                <Doughnut ref={chartRef} data={distribution} options={
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
            </Descriptions>
        </Drawer >
    );
}

export default PublicPortfolio;