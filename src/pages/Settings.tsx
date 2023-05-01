import { CopyOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Descriptions, Divider, Input, Row, Space, Switch, Tooltip, Typography, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsService from "../services/SettingsService";
import { logout, useAppDispatch } from "../app/store";

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const updateRef = useRef(null);
    const [messageApi, contextHolder] = message.useMessage();

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);

    const [id, setId] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [isValueRevealed, setIsValueRevealed] = useState<boolean>(false);
    const [allowedUsers, setAllowedUsers] = useState<string>();
    const [currencyEur, setCurrencyEur] = useState<boolean>(false);

    const getData = () => {
        SettingsService.getUserSettings().then((res) => {
            setId(res.data.portfolio_info.id);
            setEmail(res.data.user_info.email);
            setUsername(res.data.user_info.username);
            setTitle(res.data.portfolio_info.title);
            setDescription(res.data.portfolio_info.description);
            setIsPublic(res.data.portfolio_info.public);
            setIsValueRevealed(res.data.portfolio_info.reveal_value);
            setAllowedUsers(res.data.portfolio_info.allowed_users.join(', '));
            setCurrencyEur(res.data.portfolio_info.currency_eur);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
        });
    };

    console.log(allowedUsers)

    const save = () => {
        const body = {
            username: username,
            title: title,
            description: description,
            public: isPublic,
            hide_value: !isValueRevealed,
            allowed_users: allowedUsers,
            currency_eur: currencyEur
        }

        SettingsService.setUserSettings(body).then((res) => {
            success('Settings successfully updated');

            setId(res.data.portfolio_info.id);
            setEmail(res.data.user_info.email);
            setUsername(res.data.user_info.username);
            setTitle(res.data.portfolio_info.title);
            setDescription(res.data.portfolio_info.description);
            setIsPublic(res.data.portfolio_info.public);
            setIsValueRevealed(res.data.portfolio_info.reveal_value);
            setAllowedUsers(res.data.portfolio_info.allowed_users.join(', '));
            setCurrencyEur(res.data.portfolio_info.currency_eur);

            setUpdateOpen(false);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
            error('Unable to update settings');
        });
    }

    const copyPortfolioLink = () => {
        let link = location.protocol + '//' + location.host + '/explore?id=' + id;
        navigator.clipboard.writeText(link);
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

    useEffect(() => {
        if (!localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY)) {
            navigate("/")
            return;
        }

        getData();
    }, []);

    return (
        <Space direction="vertical" size="middle" style={{ display: "flex", padding: "0 0 20px 0" }}>
            {contextHolder}
            <Row justify={'center'}>
                <Col xl={16} xs={22} sm={22}>
                    <Typography>
                        <Divider></Divider>
                    </Typography>
                </Col>
            </Row>
            <Row justify="center">
                <Col xl={16} xs={22} sm={22}>
                    <Descriptions title="User information" bordered>
                        <Descriptions.Item label="User email" span={3}>{email}</Descriptions.Item>
                        <Descriptions.Item label="User name" span={3}>
                            {
                                updateOpen ?
                                    <Input showCount maxLength={30} defaultValue={username} onInput={e => setUsername((e.target as HTMLTextAreaElement).value)}></Input> :
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
                                    <Input showCount maxLength={30} defaultValue={title} onInput={e => setTitle((e.target as HTMLTextAreaElement).value)}></Input> :
                                    title
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Description" span={3}>
                            {
                                updateOpen ?
                                    <Input showCount maxLength={100} defaultValue={description} onInput={e => setDescription((e.target as HTMLTextAreaElement).value)}></Input> :
                                    description
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Public" span={3}>
                            {
                                updateOpen ?
                                    <Switch checkedChildren={'YES'} unCheckedChildren={'NO'} checked={isPublic} onChange={e => setIsPublic(e)}></Switch> :
                                    isPublic ?
                                        <Badge status="success" text="Yes" /> :
                                        <Badge status="error" text="No" />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label={
                            <Space>
                                Reveal value
                                <Tooltip
                                    placement="right"
                                    title="toggles between value and percentage for public portfolio display purposes"
                                >
                                    <InfoCircleOutlined />
                                </Tooltip>
                            </Space>
                        } span={3}>
                            {
                                updateOpen ?
                                    <Switch checkedChildren={'YES'} unCheckedChildren={'NO'} checked={isValueRevealed} onChange={e => setIsValueRevealed(e)}></Switch> :
                                    isValueRevealed ?
                                        <Badge status="success" text="Yes" /> :
                                        <Badge status="error" text="No" />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label={
                            <Space>
                                Allowed users
                                <Tooltip
                                    placement="right"
                                    title="comma separated list of user emails. 
                                    Leaving this field empty will result in anyone being able to comment under your public portfolio"
                                >
                                    <InfoCircleOutlined />
                                </Tooltip>
                            </Space>
                        } span={3}>
                            {
                                updateOpen ?
                                    <Input showCount maxLength={100} defaultValue={allowedUsers} onInput={e => setAllowedUsers((e.target as HTMLTextAreaElement).value)}></Input> :
                                    allowedUsers
                            }
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
                        <Button ref={updateRef} type="default" onClick={() => copyPortfolioLink()} disabled={(!isPublic && !updateOpen) || updateOpen}>
                            Copy link
                            <CopyOutlined />
                        </Button>
                        <Button ref={updateRef} type="default" onClick={() => setUpdateOpen(true)} hidden={updateOpen}>
                            Update
                        </Button>
                        <Button ref={updateRef} type="default" onClick={save} hidden={!updateOpen}>
                            Save
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Space>
    );
}

export default Settings;