import { DatePicker, DatePickerProps, Form, Input, Modal, message } from "antd";
import { useState } from "react";

import { useAtom } from 'jotai'
import { showAddStockModalAtom } from '../atoms';
import StocksService from "../services/StocksService";
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";


interface Props {
    onDone: () => void
}

const AddStock = (props: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [ticker, setTicker] = useState<string>('')
    const [quantity, setQuantity] = useState<number>(0)
    const [date, setDate] = useState<string>('')
    const [showModal, setShowModal] = useAtom(showAddStockModalAtom)

    const handleOk = () => {
        StocksService.createStock({ ticker: ticker, quantity: quantity, date: date }).then(() => {
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
        setTicker('')
        setQuantity(0)
        setDate('')
        setShowModal(false);
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

    return (
        <Modal
            title="Create stock investment"
            open={showModal}
            onOk={handleOk}
            centered
            cancelButtonProps={{ hidden: true }}
            okText={'Create'}
            onCancel={handleCancel}
        >
            {contextHolder}
            <p>Add your new stock investment that will instantly alter your portfolio history</p>
            <Form>
                <Form.Item required={true}>
                    <Input value={ticker} onInput={e => setTicker((e.target as HTMLTextAreaElement).value.toUpperCase())} placeholder="ticker" />
                </Form.Item>
                <Form.Item required={true}>
                    <Input value={quantity} onInput={e => setQuantity(Number((e.target as HTMLTextAreaElement).value))} placeholder="quantity" type="number" />
                </Form.Item>
                <Form.Item required={true}>
                    <DatePicker placeholder="date" onChange={onDateChange} disabledDate={d => !d || d.isBefore('2023-01-01') || d.isAfter(Date.now())} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddStock;