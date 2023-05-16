import { Form, Input, Modal, message } from "antd";

import { isAxiosError } from "axios";
import { useAtom } from 'jotai';
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";
import { showAddEthereumWalletConnectionModalAtom } from '../atoms';
import ConnectionsService from "../services/ConnectionsService";

interface Props {
    refresh: () => void;
}

const AddEthereumWalletConnection = (props: Props) => {
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [showModal, setShowModal] = useAtom(showAddEthereumWalletConnectionModalAtom)

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
        form.resetFields();
        setShowModal(false);
    };

    const handleOk = () => {
        void form.validateFields()
            .then((values) => {
                ConnectionsService.createEthereumWalletConnection({ address: values.address }).then(() => {
                    success('Ethereum wallet was successfully connected')
                    setShowModal(false);
                    props.refresh();
                }).catch((err) => {
                    if (isAxiosError(err) && err.response && err.response.status === 401) {
                        dispatch(logout());
                        navigate("/");
                        return;
                    }
                    error('Unable to connect Ethereum wallet');
                    setShowModal(false);
                });
            });
    };

    return (
        <Modal
            title={"Connect your Ethereum wallet"}
            open={showModal}
            onOk={handleOk}
            centered
            cancelButtonProps={{ hidden: true }}
            okText={'Connect'}
            onCancel={handleCancel}
        >
            {contextHolder}
            <br></br>
            <Form form={form}>
                <Form.Item
                    rules={[
                        { required: true, message: 'address is required' },
                        { max: 42, message: 'Ethereum wallet address length cannot exceed 42 characters' },
                        // { pattern: new RegExp("/^0x[a-fA-F0-9]{40}$/g"), message: 'Invalid address' }
                    ]}
                    name="address"
                >
                    <Input
                        placeholder="address"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddEthereumWalletConnection;