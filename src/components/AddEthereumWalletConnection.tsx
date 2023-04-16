import { Form, Input, Modal } from "antd";
import { useState } from "react";

import { useAtom } from 'jotai'
import { showAddEthereumWalletConnectionModalAtom } from '../atoms';
import ConnectionsService from "../services/ConnectionsService";
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";

const AddEthereumWalletConnection: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [address, setAddress] = useState<string>('')
    const [showModal, setShowModal] = useAtom(showAddEthereumWalletConnectionModalAtom)

    const handleOk = () => {
        ConnectionsService.createEthereumWalletConnection({ address: address }).then(() => {
            setShowModal(false);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
            }
        });
    };

    const handleCancel = () => {
        setAddress('')
        setShowModal(false);
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