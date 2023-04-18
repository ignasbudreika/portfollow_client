import { DatePicker, Form, InputNumber, Modal, Switch, message } from "antd";

import { useAtom } from 'jotai'
import { selectedInvestmentIdAtom, showAddTxModalAtom } from '../atoms';
import InvestmentService from "../services/InvestmentService";
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";
import dayjs from "dayjs";

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
    form.validateFields()
      .then((values) => {
        InvestmentService.createTx(id, {
          quantity: values.quantity,
          type: values.type ? 'BUY' : 'SELL',
          date: values.date.toDate()
        }).then(() => {
          props.onDone();
          success('Transaction was successfully created');
        }).catch((err) => {
          if (err.response.status === 401) {
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

  const handleCancel = () => {
    setId('');
    form.resetFields();
    setShowModal(false);
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
        initialValues={{ date: dayjs(), type: false, quantity: 1 }}
      >
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
        <Form.Item name='type'>
          <Switch
            checkedChildren={"buy"}
            unCheckedChildren={"sell"}
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