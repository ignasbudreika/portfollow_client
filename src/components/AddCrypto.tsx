import { DatePicker, DatePickerProps, Form, Input, Modal } from "antd";
import { useState } from "react";

import {useAtom} from 'jotai'
import { showAddCryptoModalAtom } from '../atoms';
import CryptocurrenciesService from "../services/CryptocurrenciesService";

const AddCrypto: React.FC = () => {
    const [symbol, setSymbol] = useState<string>('')
    const [quantity, setQuantity] = useState<number>(0)
    const [date, setDate] = useState<string>('')
    const [showModal, setShowModal] = useAtom(showAddCryptoModalAtom)
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = () => {
        CryptocurrenciesService.createCrypto({symbol: symbol, quantity: quantity, date: date})
        setConfirmLoading(true);
        setShowModal(false);
        setConfirmLoading(false);
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
          title="Create cryptocurrency investment"
          open={showModal}
          onOk={handleOk}
          centered 
          confirmLoading={confirmLoading}
          cancelButtonProps={{hidden: true}}
          okText={'Create'}
          onCancel={handleCancel}
        >
          <p>Add your new cryptocurrency investment that will instantly alter your portfolio history</p>
          <Form>
              <Form.Item required={true}>
                  <Input value={symbol} onInput={e => setSymbol((e.target as HTMLTextAreaElement).value.toUpperCase())} placeholder="symbol"/>
              </Form.Item>
              <Form.Item required={true}>
                    <Input value={quantity} onInput={e => setQuantity(Number((e.target as HTMLTextAreaElement).value))} placeholder="quantity" type="number" />
                </Form.Item>
              <Form.Item required={true}>
                  <DatePicker placeholder="date" onChange={onDateChange} disabledDate={d => !d || d.isBefore('2023-01-01')} />
              </Form.Item>
          </Form>
        </Modal>
    );
}

export default AddCrypto;