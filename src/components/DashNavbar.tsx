import { Button, Row, Space } from "antd";
import { useNavigate } from 'react-router-dom';

const DashNavbar: React.FC = () => {
const navigate = useNavigate();

    return <Space direction="vertical" size="middle" style={{ display: "flex", padding: "20px 0" }}>
        <Row justify={"center"}>
            <Space align="center"> 
                <Button shape="round" type="primary" onClick={() => navigate("/dash")}
                    style={{  backgroundColor: window.location.pathname === "/dash" ? "#AEBED5" : "#121F2B" }}
                >
                    Statistics
                </Button>
                <Button shape="round" type="primary" onClick={() => navigate("/stocks")}
                    style={{  backgroundColor: window.location.pathname === "/stocks" ? "#AEBED5" : "#121F2B" }}
                >
                    Stocks
                </Button>
                <Button shape="round" type="primary" onClick={() => navigate("/crypto")}
                    style={{  backgroundColor: window.location.pathname === "/crypto" ? "#AEBED5" : "#121F2B" }}
                >
                    Crypto
                </Button>
                <Button shape="round" type="primary"
                    style={{  backgroundColor: window.location.pathname === "/forex" ? "#AEBED5" : "#121F2B" }}
                >
                    Forex
                </Button>
                <Button shape="round" type="primary" onClick={() => navigate("/connections")}
                    style={{  backgroundColor: window.location.pathname === "/connections" ? "#AEBED5" : "#121F2B" }}
                >
                    Connections
                </Button>
                <Button shape="round" type="primary"
                    style={{  backgroundColor: window.location.pathname === "/explore" ? "#AEBED5" : "#121F2B" }}
                >
                    Explore
                </Button>
                <Button shape="round" type="primary"
                    style={{  backgroundColor: window.location.pathname === "/profile" ? "#AEBED5" : "#121F2B" }}
                >
                    Profile
                </Button>
            </Space>
        </Row>
    </Space>;
}

export default DashNavbar;