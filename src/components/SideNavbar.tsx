import { BulbOutlined, EuroCircleOutlined, PieChartOutlined, SettingOutlined, StockOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Row, Space } from 'antd';
import { useAtom } from 'jotai';
import React from 'react'
import { useNavigate } from 'react-router';
import { showDrawerAtom } from '../atoms';

export const SideNavbar: React.FC = () => {
    const navigate = useNavigate();
    const [, setShowDrawer] = useAtom(showDrawerAtom)

    const navigateTo = (path: string) => {
        setShowDrawer(false);
        navigate(path);
    }

    return <Space direction="vertical" size="middle"
        style={{
            display: "flex",
            padding: "0 0 20px 0",
            backgroundColor: "#F5F5F5"
        }}>
        <Row justify="center">
            <Button type="primary" icon={<PieChartOutlined />} size={'large'} onClick={() => navigateTo("/dash")}
                style={{ backgroundColor: window.location.pathname === "/dash" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<StockOutlined />} size={'large'} onClick={() => navigateTo("/stocks")}
                style={{ backgroundColor: window.location.pathname === "/stocks" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<EuroCircleOutlined />} size={'large'} onClick={() => navigateTo("/currencies")}
                style={{ backgroundColor: window.location.pathname === "/currencies" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<UserAddOutlined />} size={'large'} onClick={() => navigateTo("/connections")}
                style={{ backgroundColor: window.location.pathname === "/connections" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<BulbOutlined />} size={'large'} style={{ backgroundColor: window.location.pathname === "/explore" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
        <Row justify="center">
            <Button type="primary" icon={<SettingOutlined />} size={'large'} onClick={() => navigateTo("/settings")}
                style={{ backgroundColor: window.location.pathname === "/settings" ? "#c7c4c5" : "#121F2B" }} />
        </Row>
    </Space>;
}

export default SideNavbar