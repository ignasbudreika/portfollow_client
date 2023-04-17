import { Form, Input, Modal, Row, Tooltip, message } from "antd";
import { useState } from "react";

import { useAtom } from 'jotai'
import { showAddSpectrocoinConnectionModalAtom } from '../atoms';
import ConnectionsService from "../services/ConnectionsService";
import { InfoCircleOutlined } from "@ant-design/icons";
import { logout, useAppDispatch } from "../app/store";
import { useNavigate } from "react-router-dom";

interface Props {
    refresh: () => void;
}

const AddSpectrocoinConnection = (props: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [clientId, setClientId] = useState<string>('')
    const [clientSecret, setClientSecret] = useState<string>('')
    const [showModal, setShowModal] = useAtom(showAddSpectrocoinConnectionModalAtom)

    const handleOk = () => {
        ConnectionsService.createSpectrocoinConnection({ client_id: clientId, client_secret: clientSecret }).then(() => {
            success('SpectroCoin account was successfully connected')
            setShowModal(false);
            props.refresh();
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
            error('Unable to connect SpectroCoin account');
            setShowModal(false);
        });
    };

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

    const handleCancel = () => {
        setClientId('')
        setClientSecret('')
        setShowModal(false);
    };

    return (
        <Modal
            title={"Connect your SpectroCoin account"}
            open={showModal}
            onOk={handleOk}
            centered
            cancelButtonProps={{ hidden: true }}
            okText={'Connect'}
            onCancel={handleCancel}
        >
            {contextHolder}
            <Form>
                <Row justify={'space-between'}>
                    <p>Enter your wallet API client credentials</p>
                    <Tooltip title="scope user_account is required in order to access wallet information">
                        <InfoCircleOutlined />
                    </Tooltip>
                </Row>
                {/* todo remove <br> from project */}
                <Form.Item required={true}>
                    <Input value={clientId} onInput={e => setClientId((e.target as HTMLTextAreaElement).value)} placeholder="client ID" />
                </Form.Item>
                <Form.Item required={true}>
                    <Input.Password value={clientSecret} onInput={e => setClientSecret((e.target as HTMLTextAreaElement).value)} placeholder="client secret" type="secret" />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddSpectrocoinConnection;