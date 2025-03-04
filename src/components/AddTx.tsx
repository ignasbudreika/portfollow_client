import { DatePicker, Form, InputNumber, Modal, Switch, message } from "antd";

import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useAtom } from 'jotai';
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";
import { selectedInvestmentIdAtom, showAddTxModalAtom } from '../atoms';
import InvestmentService from "../services/InvestmentService";

interface Props {
  onDone: () => void
}

const AddTx = (props: Props) => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [id, setId] = useAtom(selectedInvestmentIdAtom)
  const [showModal, setShowModal] = useAtom(showAddTxModalAtom)

  const handleOk = () => {
    void form.validateFields()
      .then((values) => {
        InvestmentService.createTx(id, {
          quantity: values.quantity,
          type: values.txType ? 'BUY' : 'SELL',
          date: values.date.toDate()
        }).then(() => {
          props.onDone();
          success('Transaction was successfully created');
        }).catch((err) => {
          if (isAxiosError(err) && err.response && err.response.status === 401) {
            dispatch(logout());
            navigate("/");
            return;
          }
          error('Unable to create transaction');
        });
        form.resetFields();
        setShowModal(false);
      })
  };

  const success = (message: string) => {
    void messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = (message: string) => {
    void messageApi.open({
      type: 'error',
      content: message,
    });
  };

  const handleCancel = () => {
    setId('');
    form.resetFields();
    setShowModal(false);
  };

  const formatValue = (value: string | undefined) => {
    if (value === undefined || value === null) {
      return '';
    }
    return value.replace('/\.?0+$/', '');
  };

  return (
    <Modal
      title="Create transaction"
      open={showModal}
      onOk={handleOk}
      centered
      cancelButtonProps={{ hidden: true }}
      okText={'Create'}
      onCancel={handleCancel}
    >
      {contextHolder}
      <p>Add new transaction for your investment</p>
      <Form
        form={form}
        initialValues={{ date: dayjs(), txType: true, quantity: 1 }}
      >
        <Form.Item
          name="quantity"
          rules={[{ required: true, message: 'quantity is required' }]}
        >
          <InputNumber<string>
            style={{ width: 200 }}
            min="0.00000001"
            precision={8}
            step="1"
            formatter={formatValue}
            placeholder="quantity"
            stringMode
          />
        </Form.Item>
        <Form.Item
          name='txType'
          valuePropName="checked"
        >
          <Switch
            checkedChildren={"BUY"}
            unCheckedChildren={"SELL"}
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

export default AddTx;