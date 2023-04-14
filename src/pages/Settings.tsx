import { InfoCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Descriptions, Row, Space, Switch, Tooltip, TourProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsService from "../services/SettingsService";
import { logout, useAppDispatch } from "../app/store";

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const updateRef = useRef(null);
    const resetRef = useRef(null);
    const deleteRef = useRef(null);

    const [setupOpen, setSetupOpen] = useState<boolean>(false);

    const [needsSetup, setNeedsSetup] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [isValueRevealed, setIsValueRevealed] = useState<boolean>(false);
    const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
    const [currencyEur, setCurrencyEur] = useState<boolean>(false);

    const steps: TourProps['steps'] = [
        {
            title: 'Update information',
            description: 'Keep your portfolio information up to date.',
            target: () => updateRef.current,
        },
        {
            title: 'Reset portfolio',
            description: 'Deletes all the investments, connections.',
            target: () => resetRef.current,
        },
        {
            title: 'Delete your account',
            description: 'Deletes the account entirely. ',
            target: () => deleteRef.current,
        },
    ];

    const getData = () => {
        SettingsService.getUserSettings().then((res) => {
            setNeedsSetup(res.data.needs_setup);
            setEmail(res.data.user_info.email);
            setUsername(res.data.user_info.username);
            setTitle(res.data.portfolio_info.title);
            setDescription(res.data.portfolio_info.description);
            setIsPublic(res.data.portfolio_info.public);
            setIsValueRevealed(res.data.portfolio_info.reveal_value);
            setAllowedUsers(res.data.portfolio_info.allowed_users);
            setCurrencyEur(res.data.portfolio_info.currency_eur);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
        });
    };

    useEffect(() => {
        if (!localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY)) {
            navigate("/")
            return;
        }

        getData();
    }, []);

    return (
        <Space direction="vertical" size="middle" style={{ display: "flex", padding: "0 0 20px 0" }}>
            <Row justify="center">
                <Col xl={16} xs={22} sm={22}>
                    <Descriptions title="User information" bordered>
                        <Descriptions.Item label="User email" span={3}>{email}</Descriptions.Item>
                        <Descriptions.Item label="User name" span={3}>{username}</Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
            <Row justify="center">
                <Col xl={16} xs={22} sm={22}>
                    <Descriptions title="Portfolio information" bordered>
                        <Descriptions.Item label="Title" span={3}>{title}</Descriptions.Item>
                        <Descriptions.Item label="Description" span={3}>{description}</Descriptions.Item>
                        <Descriptions.Item label="Public" span={3}>
                            {
                                isPublic ?
                                    <Badge status="success" text="Yes" /> :
                                    <Badge status="error" text="No" />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Reveal value" span={3}>
                            {
                                isValueRevealed ?
                                    <Badge status="success" text="Yes" /> :
                                    <Badge status="error" text="No" />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label={
                            <Space>
                                Allowed users
                                <Tooltip placement="right" title="leaving allowed users empty will result in anyone being able to comment under your public portfolio">
                                    <InfoCircleOutlined />
                                </Tooltip>
                            </Space>
                        } span={3}>
                            {allowedUsers}
                        </Descriptions.Item>
                        <Descriptions.Item label="Currency" span={3}>
                            <Switch disabled checkedChildren="EUR" unCheckedChildren="USD" checked={currencyEur} />
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
            <Row justify="center">
                <Col xl={16} xs={22} sm={22}>
                    <Space>
                        <Button ref={updateRef} type="default" onClick={() => setSetupOpen(true)}>
                            Update
                        </Button>
                        <Button ref={resetRef} type="primary" danger>
                            Reset portfolio
                        </Button>
                        <Button ref={deleteRef} disabled type="primary" danger>
                            Delete account
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Space>
    );
}

export default Settings;