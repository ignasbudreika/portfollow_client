import { DatePicker, DatePickerProps, Form, Input, Modal } from "antd";
import { useState } from "react";

import {useAtom} from 'jotai'
import { showAddStockModalAtom } from '../atoms';
import StocksService from "../services/StocksService";


const AddStock: React.FC = () => {
    const [ticker, setTicker] = useState<string>('')
    const [quantity, setQuantity] = useState<number>(0)
    const [date, setDate] = useState<string>('')
    const [showModal, setShowModal] = useAtom(showAddStockModalAtom)
    const [confirmLoading, setConfirmLoading] = useState(false);
  
    const handleOk = () => {
        StocksService.createStock({ticker: ticker, quantity: quantity, date: date})
        setConfirmLoading(true);
        setShowModal(false);
        setConfirmLoading(false);
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

    return (
        <Modal
            title="Create stock investment"
            open={showModal}
            onOk={handleOk}
            centered 
            confirmLoading={confirmLoading}
            cancelButtonProps={{hidden: true}}
            okText={'Create'}
            onCancel={handleCancel}
        >
            <p>Add your new stock investment that will instantly alter your portfolio history</p>
            <Form>
                <Form.Item required={true}>
                    <Input value={ticker} onInput={e => setTicker(e.target.value.toUpperCase())} placeholder="ticker"/>
                </Form.Item>
                <Form.Item required={true}>
                    <Input value={quantity} onInput={e => setQuantity(e.target.value)} placeholder="quantity" type="number" />
                </Form.Item>
                <Form.Item required={true}>
                    <DatePicker placeholder="date" onChange={onDateChange} disabledDate={d => !d || d.isBefore('2023-01-01')} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddStock;