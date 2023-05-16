import { Form, Input, Modal, Row, message } from "antd";

import { isAxiosError } from "axios";
import { useAtom } from 'jotai';
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";
import { showAddAlpacaConnectionModalAtom } from '../atoms';
import ConnectionsService from "../services/ConnectionsService";

interface Props {
    refresh: () => void;
}

const AddAlpacaConnection = (props: Props) => {
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [showModal, setShowModal] = useAtom(showAddAlpacaConnectionModalAtom)

    const handleOk = () => {
        void form.validateFields()
            .then((values) => {
                ConnectionsService.createAlpacaConnection({ api_key: values.apiKey, secret: values.secret }).then(() => {
                    success('Alpaca account was successfully connected')
                    setShowModal(false);
                    props.refresh();
                }).catch((err) => {
                    if (isAxiosError(err) && err.response && err.response.status === 401) {
                        dispatch(logout());
                        navigate("/");
                    }
                    error('Unable to connect Alpaca account');
                    setShowModal(false);
                });
            });
    };

    const success = (message: string) => {
        void messageApi.open({
            type: 'success',
            content: message,
        });
    };

    const error = (message: string) => {
        void messageApi.open({
            type: 'error',
            content: message,
        });
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <Modal
            title={"Connect your Alpaca account"}
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
                    <p>Enter your API key credentials</p>
                </Row>
                <Form.Item
                    name="apiKey"
                    rules={[
                        { required: true, message: 'API key is required' },
                    ]}
                >
                    <Input
                        placeholder="API key"
                    />
                </Form.Item>
                <Form.Item
                    name="secret"
                    rules={[
                        { required: true, message: 'API key secret is required' },
                    ]}
                >
                    <Input.Password
                        placeholder="secret"
                        type="secret"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddAlpacaConnection;