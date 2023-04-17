import { DatePicker, DatePickerProps, Form, Input, Modal, Select, message } from "antd";
import { useState } from "react";

import { useAtom } from 'jotai'
import { selectedInvestmentIdAtom, showAddTxModalAtom } from '../atoms';
import InvestmentService from "../services/InvestmentService";
import { useNavigate } from "react-router-dom";
import { logout, useAppDispatch } from "../app/store";

interface Props {
  onDone: () => void
}

const AddTx = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [id, setId] = useAtom(selectedInvestmentIdAtom)
  const [quantity, setQuantity] = useState<number>(0)
  const [type, setType] = useState<string>('BUY')
  const [date, setDate] = useState<string>('')
  const [showModal, setShowModal] = useAtom(showAddTxModalAtom)

  const handleOk = () => {
    InvestmentService.createTx(id, { quantity: quantity, type: type, date: date }).then(() => {
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

  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDate(dateString)
  };

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleCancel = () => {
    setId('')
    setQuantity(0)
    setType('BUY')
    setDate('')
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
      <Form>
        <Form.Item required={true}>
          <Input value={quantity} onInput={e => setQuantity(Number((e.target as HTMLTextAreaElement).value))} placeholder="quantity" type="number" />
        </Form.Item>
        <Form.Item required={true}>
          <Select
            defaultValue="BUY"
            style={{ width: 120 }}
            onChange={handleTypeChange}
            options={[
              { value: 'BUY', label: 'BUY' },
              { value: 'SELL', label: 'SELL' },
            ]}
          />
        </Form.Item>
        <Form.Item required={true}>
          <DatePicker placeholder="date" onChange={onDateChange} disabledDate={d => !d || d.isBefore('2023-01-01') || d.isAfter(Date.now())} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddTx;