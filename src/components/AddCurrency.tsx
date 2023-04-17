import { DatePicker, DatePickerProps, Form, Input, Modal, Switch, message } from "antd";
import { useState } from "react";

import { useAtom } from 'jotai'
import { showAddCryptoModalAtom } from '../atoms';
import CurrenciesService from "../services/CurrenciesService";
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";

interface Props {
    onDone: () => void
}

const AddCurrency = (props: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [symbol, setSymbol] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);
    const [date, setDate] = useState<string>('');
    const [isCrypto, setIsCrypto] = useState<boolean>(false);
    const [showModal, setShowModal] = useAtom(showAddCryptoModalAtom);

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

    const handleOk = () => {
        CurrenciesService.createCurrency({ symbol: symbol, quantity: quantity, date: date, crypto: isCrypto }).then(() => {
            success('Investment was successfully created');
            props.onDone();
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                navigate("/");
                return;
            }
            error('Unable to create investment');
        });
        setShowModal(false);
    };

    const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(dateString)
    };

    const handleCancel = () => {
        setSymbol('')
        setQuantity(0)
        setDate('')
        setShowModal(false);
    };

    return (
        <Modal
            title="Create currency investment"
            open={showModal}
            onOk={handleOk}
            centered
            cancelButtonProps={{ hidden: true }}
            okText={'Create'}
            onCancel={handleCancel}
        >
            {contextHolder}
            <p>Add your new currency investment that will instantly alter your portfolio history</p>
            <Form>
                <Form.Item required={true}>
                    <Input value={symbol} onInput={e => setSymbol((e.target as HTMLTextAreaElement).value.toUpperCase())} placeholder="symbol" />
                </Form.Item>
                <Form.Item required={true}>
                    <Input value={quantity} onInput={e => setQuantity(Number((e.target as HTMLTextAreaElement).value))} placeholder="quantity" type="number" />
                </Form.Item>
                <Form.Item required={true}>
                    <Switch
                        checkedChildren={"crypto"}
                        unCheckedChildren={"forex"}
                        onChange={value => setIsCrypto(value)} />
                </Form.Item>
                <Form.Item required={true}>
                    <DatePicker placeholder="date" onChange={onDateChange} disabledDate={d => !d || d.isBefore('2023-01-01') || d.isAfter(Date.now())} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddCurrency;