import { DatePicker, Form, Input, InputNumber, Modal, message } from "antd";

import { useAtom } from 'jotai'
import { showAddStockModalAtom } from '../atoms';
import StocksService from "../services/StocksService";
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";
import dayjs from "dayjs";


interface Props {
    onDone: () => void
}

const AddStock = (props: Props) => {
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [showModal, setShowModal] = useAtom(showAddStockModalAtom)

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                StocksService.createStock({
                    ticker: values.ticker.toUpperCase(),
                    quantity: values.quantity,
                    date: values.date.toDate(),
                }).then(() => {
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
                form.resetFields();
                setShowModal(false);
            });
    };

    const handleCancel = () => {
        form.resetFields();
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
            <Form
                form={form}
                initialValues={{ date: dayjs(), quantity: 1 }}
            >
                <Form.Item
                    name="ticker"
                    rules={[{ required: true, message: 'ticker is required' }]}
                >
                    <Input placeholder="ticker" />
                </Form.Item>
                <Form.Item
                    name="quantity"
                    rules={[{ required: true, message: 'quantity is required' }]}
                >
                    <InputNumber<string>

                        style={{ width: 200 }}
                        min="0"
                        defaultValue="1"
                        step="1"
                        placeholder="quantity"
                        stringMode
                    />
                </Form.Item>
                <Form.Item
                    name="date"
                    rules={[{ required: true, message: 'date is required' }]}
                >
                    <DatePicker placeholder="date" disabledDate={d => !d || d.isBefore('2023-01-01') || d.isAfter(Date.now())} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddStock;