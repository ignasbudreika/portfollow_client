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
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [showModal, setShowModal] = useAtom(showAddSpectrocoinConnectionModalAtom)

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                ConnectionsService.createSpectrocoinConnection({ client_id: values.clientID, client_secret: values.clientSecret }).then(() => {
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
            <Form form={form}>
                <Row justify={'space-between'}>
                    <p>Enter your wallet API client credentials</p>
                    <Tooltip title="scope user_account is required in order to access wallet information">
                        <InfoCircleOutlined />
                    </Tooltip>
                </Row>
                <Form.Item
                    name="clientID"
                    rules={[
                        { required: true, message: 'client ID is required' },
                    ]}
                >
                    <Input
                        placeholder="client ID"
                    />
                </Form.Item>
                <Form.Item
                    name="clientSecret"
                    rules={[
                        { required: true, message: 'client secret is required' },
                    ]}
                >
                    <Input.Password
                        placeholder="client secret"
                        type="secret"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddSpectrocoinConnection;