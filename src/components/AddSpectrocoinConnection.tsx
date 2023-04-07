import { Form, Input, Modal, Row, Tooltip } from "antd";
import { useState } from "react";

import {useAtom} from 'jotai'
import { showAddSpectrocoinConnectionModalAtom } from '../atoms';
import ConnectionsService from "../services/ConnectionsService";
import { InfoCircleOutlined } from "@ant-design/icons";


const AddSpectrocoinConnection: React.FC = () => {
    const [clientId, setClientId] = useState<string>('')
    const [clientSecret, setClientSecret] = useState<string>('')
    const [showModal, setShowModal] = useAtom(showAddSpectrocoinConnectionModalAtom)
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = () => {
        ConnectionsService.createSpectrocoinConnection({client_id: clientId, client_secret: clientSecret})
        setConfirmLoading(true);
        setShowModal(false);
        setConfirmLoading(false);
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
          confirmLoading={confirmLoading}
          cancelButtonProps={{hidden: true}}
          okText={'Connect'}
          onCancel={handleCancel}
        >
            <Form>
                <Row justify={'space-between'}>
                    <p>Enter your wallet API client credentials</p>
                    <Tooltip title="scope user_account is required in order to access wallet information">
                        <InfoCircleOutlined />
                    </Tooltip>
                </Row>
                {/* todo remove <br> from project */}
                <Form.Item required={true}>
                    <Input value={clientId} onInput={e => setClientId((e.target as HTMLTextAreaElement).value)} placeholder="client ID"/>
                </Form.Item>
                <Form.Item required={true}>
                    <Input.Password value={clientSecret} onInput={e => setClientSecret((e.target as HTMLTextAreaElement).value)} placeholder="client secret" type="secret"/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddSpectrocoinConnection;