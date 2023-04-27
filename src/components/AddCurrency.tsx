import { DatePicker, Form, Input, InputNumber, Modal, Select, Switch, message } from "antd";

import { useAtom } from 'jotai'
import { showAddCryptoModalAtom } from '../atoms';
import CurrenciesService from "../services/CurrenciesService";
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";
import dayjs from "dayjs";

interface Props {
    periodic: boolean
    onDone: () => void
}

const AddCurrency = (props: Props) => {
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();

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

    console.log(props.periodic)

    const handleOk = () => {
        form.validateFields().then((values) => {
            CurrenciesService.createCurrency({
                symbol: values.symbol.toUpperCase(),
                quantity: values.quantity,
                date: values.date.toDate(),
                crypto: values.type,
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
        })
    };

    const formatValue = (value: string | undefined) => {
        if (value === undefined || value === null) {
            return '';
        }
        return value.replace('/\.?0+$/', '');
    };

    const handleCancel = () => {
        form.resetFields();
        setShowModal(false);
    };

    return (
        <Modal
            title={
                props.periodic ?
                    "Set up periodic currency investment" :
                    "Create currency investment"
            }
            open={showModal}
            onOk={handleOk}
            centered
            cancelButtonProps={{ hidden: true }}
            okText={'Create'}
            onCancel={handleCancel}
        >
            {contextHolder}
            <p>Add your new currency investment that will instantly alter your portfolio history</p>
            <Form
                form={form}
                initialValues={{ date: dayjs(), type: false, quantity: 1, period: props.periodic ? 'DAILY' : undefined }}
            >
                <Form.Item
                    name="symbol"
                    rules={[
                        { required: true, message: 'symbol is required' },
                        { max: 6, message: 'currency symbol length cannot exceed 6 characters' }
                    ]}
                >
                    <Input
                        placeholder="symbol"
                        onInput={e => (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase()}
                    />
                </Form.Item>
                <Form.Item name='type'>
                    <Switch
                        checkedChildren={"CRYPTO"}
                        unCheckedChildren={"FIAT"}
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
                    name="quantity"
                    rules={[{ required: true, message: 'quantity is required' }]}
                >
                    <InputNumber<string>
                        style={{ width: 200 }}
                        min="0.00000001"
                        precision={8}
                        formatter={formatValue}
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
                    <DatePicker placeholder="date" disabled={props.periodic} disabledDate={d => !d || d.isBefore('2023-01-01') || d.isAfter(Date.now())} />
                </Form.Item>
            </Form>
        </Modal >
    );
}

export default AddCurrency;