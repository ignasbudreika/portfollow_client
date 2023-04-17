import { Form, Input, Modal, message } from "antd";
import { useState } from "react";

import { useAtom } from 'jotai'
import { showAddEthereumWalletConnectionModalAtom } from '../atoms';
import ConnectionsService from "../services/ConnectionsService";
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";

interface Props {
    refresh: () => void;
}

const AddEthereumWalletConnection = (props: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [address, setAddress] = useState<string>('')
    const [showModal, setShowModal] = useAtom(showAddEthereumWalletConnectionModalAtom)

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
        setAddress('')
        setShowModal(false);
    };

    const handleOk = () => {
        ConnectionsService.createEthereumWalletConnection({ address: address }).then(() => {
            success('Ethereum wallet was successfully connected')
            setShowModal(false);
            props.refresh();
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
            error('Unable to connect Ethereum wallet');
            setShowModal(false);
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
            <Form>
                <Form.Item required={true}>
                    <Input value={address} onInput={e => setAddress((e.target as HTMLTextAreaElement).value)} placeholder="address" />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddEthereumWalletConnection;