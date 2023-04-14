import { InfoCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Descriptions, Input, Row, Space, Switch, Tooltip, TourProps } from "antd";
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

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);

    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [isValueRevealed, setIsValueRevealed] = useState<boolean>(false);
    const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
    const [currencyEur, setCurrencyEur] = useState<boolean>(false);

    const getData = () => {
        SettingsService.getUserSettings().then((res) => {
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

    const save = () => {
        const body = {
            username: username,
            title: title,
            description: description,
            public: isPublic,
            hide_value: !isValueRevealed,
            allowed_users: allowedUsers.join(','),
            currency_eur: currencyEur
        }

        SettingsService.setUserSettings(body).then((res) => {
            setEmail(res.data.user_info.email);
            setUsername(res.data.user_info.username);
            setTitle(res.data.portfolio_info.title);
            setDescription(res.data.portfolio_info.description);
            setIsPublic(res.data.portfolio_info.public);
            setIsValueRevealed(res.data.portfolio_info.reveal_value);
            setAllowedUsers(res.data.portfolio_info.allowed_users);
            setCurrencyEur(res.data.portfolio_info.currency_eur);

            setUpdateOpen(false);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
        });
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
            <Row justify="center">
                <Col xl={16} xs={22} sm={22}>
                    <Descriptions title="User information" bordered>
                        <Descriptions.Item label="User email" span={3}>{email}</Descriptions.Item>
                        <Descriptions.Item label="User name" span={3}>
                            {
                                updateOpen ?
                                    <Input defaultValue={username} onInput={e => setUsername((e.target as HTMLTextAreaElement).value)}></Input> :
                                    username
                            }
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
            <Row justify="center">
                <Col xl={16} xs={22} sm={22}>
                    <Descriptions title="Portfolio information" bordered>
                        <Descriptions.Item label="Title" span={3}>
                            {
                                updateOpen ?
                                    <Input defaultValue={title} onInput={e => setTitle((e.target as HTMLTextAreaElement).value)}></Input> :
                                    title
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Description" span={3}>
                            {
                                updateOpen ?
                                    <Input defaultValue={description} onInput={e => setDescription((e.target as HTMLTextAreaElement).value)}></Input> :
                                    description
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Public" span={3}>
                            {
                                updateOpen ?
                                    <Switch checked={isPublic} onChange={e => setIsPublic(e)}></Switch> :
                                    isPublic ?
                                        <Badge status="success" text="Yes" /> :
                                        <Badge status="error" text="No" />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Reveal value" span={3}>
                            {
                                updateOpen ?
                                    <Switch checked={isValueRevealed} onChange={e => setIsValueRevealed(e)}></Switch> :
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
                        <Button ref={updateRef} type="default" onClick={() => setUpdateOpen(true)} hidden={updateOpen}>
                            Update
                        </Button>
                        <Button ref={updateRef} type="default" onClick={save} hidden={!updateOpen}>
                            Save
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