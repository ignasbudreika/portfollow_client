import Icon, { BulbOutlined, DownloadOutlined, EuroCircleOutlined, MehOutlined, PieChartOutlined, SettingOutlined, StockOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Row, Space } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router';

export const SideNavbar: React.FC = () => {
    const navigate = useNavigate();

    return <Space direction="vertical" size="middle"
        style={{
            display: "flex",
            padding: "0 0 20px 0",
            backgroundColor: "#F5F5F5"
        }}>
        <Row justify="center">
            <Button type="primary" icon={<PieChartOutlined />} size={'large'} onClick={() => navigate("/dash")}
                style={{ backgroundColor: window.location.pathname === "/dash" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<StockOutlined />} size={'large'} onClick={() => navigate("/stocks")}
                style={{ backgroundColor: window.location.pathname === "/stocks" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<MehOutlined />} size={'large'} onClick={() => navigate("/crypto")}
                style={{ backgroundColor: window.location.pathname === "/crypto" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<EuroCircleOutlined />} size={'large'} style={{ backgroundColor: window.location.pathname === "/forex" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<UserAddOutlined />} size={'large'} onClick={() => navigate("/connections")}
                style={{ backgroundColor: window.location.pathname === "/connections" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<BulbOutlined />} size={'large'} style={{ backgroundColor: window.location.pathname === "/explore" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<SettingOutlined />} size={'large'} style={{ backgroundColor: window.location.pathname === "/profile" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
    </Space>;
}

export default SideNavbar