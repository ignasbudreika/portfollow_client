import { Row, Timeline } from "antd";

const EmptyPortfolio: React.FC = () => {
    return (
        <Row justify="center" style={{height: '100%'}}>
            <Timeline
                items={[
                    {
                        color: 'gray',
                        children: 'Join portfollow',
                    },
                    {
                        color: 'gray',
                        children: 'Add your first investment',
                    },
                    {
                        color: 'gray',
                        children: 'Connect your SpectroCoin account',
                    },
                    {
                        color: 'gray',
                        children: 'Connect your Ethereum wallet',
                    },
                    {
                        color: 'gray',
                        children: 'Track your portfolio statistics and historical data',
                    },
                    {
                        color: 'gray',
                        children: 'Publish your portfolio and seek ideas from others',
                    },
                    {
                        color: 'gray',
                        children: 'Set up your periodic investments to keep everything up to date automatically',
                    },
                ]}
            >    
            </Timeline>
        </Row>
    );
}

export default EmptyPortfolio;