import { DatePicker, Form, Input, InputNumber, Modal, Select, message } from "antd";

import dayjs from "dayjs";
import { useAtom } from 'jotai';
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";
import { showAddStockModalAtom } from '../atoms';
import StocksService from "../services/StocksService";


interface Props {
    periodic: boolean
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
                    quantity: props.periodic ? 0 : values.quantity,
                    amount: props.periodic ? values.sum : 0,
                    date: values.date.toDate(),
                    period: values.period,
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

    const formatValue = (value: string | undefined) => {
        if (value === undefined || value === null) {
            return '';
        }
        return value.replace('/\.?0+$/', '');
    };

    const error = (message: string) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };

    return (
        <Modal
            title={
                props.periodic ?
                    "Set up periodic stock investment" :
                    "Create stock investment"
            }
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
                initialValues={{ date: dayjs(), sum: 1, quantity: 1, period: props.periodic ? 'DAILY' : undefined }}
            >
                <Form.Item
                    name="ticker"
                    rules={[
                        { required: true, message: 'ticker is required' },
                        { max: 6, message: 'stock ticker length cannot exceed 6 characters' }
                    ]}
                >
                    <Input
                        placeholder="ticker"
                        onInput={e => (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase()}
                    />
                </Form.Item>
                <Form.Item hidden={!props.periodic} name='period'>
                    <Select
                        placeholder="Period"
                        defaultValue="DAILY"
                        options={[
                            { value: 'DAILY', label: 'Daily' },
                            { value: 'WEEKLY', label: 'Weekly' },
                            { value: 'MONTHLY', label: 'Monthly' },
                            { value: 'QUARTERLY', label: 'Quarterly' },
                            { value: 'YEARLY', label: 'Yearly' }
                        ]}>

                    </Select>
                </Form.Item>
                <Form.Item
                    hidden={!props.periodic}
                    name="sum"
                    rules={[{ required: true, message: 'sum is required' }]}
                >
                    <InputNumber<string>
                        style={{ width: 200 }}
                        min="0.00000001"
                        defaultValue="1"
                        step="1"
                        precision={8}
                        formatter={formatValue}
                        placeholder="sum"
                        stringMode
                    />
                </Form.Item>
                <Form.Item
                    hidden={props.periodic}
                    name="quantity"
                    rules={[{ required: true, message: 'quantity is required' }]}
                >
                    <InputNumber<string>
                        style={{ width: 200 }}
                        min="0.00000001"
                        precision={8}
                        formatter={formatValue}
                        step="1"
                        placeholder="quantity"
                        stringMode
                    />
                </Form.Item>
                <Form.Item
                    name="date"
                    rules={[{ required: true, message: 'date is required' }]}
                >
                    <DatePicker placeholder="date" disabled={props.periodic} disabledDate={d => !d || d.isBefore('2023-01-01') || d.isAfter(Date.now())} />
                </Form.Item>
            </Form>
        </Modal >
    );
}

export default AddStock;