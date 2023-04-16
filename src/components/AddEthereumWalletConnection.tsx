import { Form, Input, Modal } from "antd";
import { useState } from "react";

import { useAtom } from 'jotai'
import { showAddEthereumWalletConnectionModalAtom } from '../atoms';
import ConnectionsService from "../services/ConnectionsService";

const AddEthereumWalletConnection: React.FC = () => {
    const [address, setAddress] = useState<string>('')
    const [showModal, setShowModal] = useAtom(showAddEthereumWalletConnectionModalAtom)
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = () => {
        ConnectionsService.createEthereumWalletConnection({ address: address })
        setShowModal(false);
    };

    const handleCancel = () => {
        setAddress('')
        setConfirmLoading(true);
        setShowModal(false);
        setConfirmLoading(false);
    };

    return (
        <Modal
            title={"Connect your Ethereum wallet"}
            open={showModal}
            onOk={handleOk}
            centered
            confirmLoading={confirmLoading}
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