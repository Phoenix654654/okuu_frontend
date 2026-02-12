import {useState} from "react";
import {Modal, Form, DatePicker, InputNumber, message} from "antd";
import type {Dayjs} from "dayjs";
import {observer} from "mobx-react-lite";
import {TaskStore} from "@/5_entities/task";

interface AssignDescriberModalProps {
    open: boolean;
    taskId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export const AssignDescriberModal = observer(({open, taskId, onClose, onSuccess}: AssignDescriberModalProps) => {
    const [describerId, setDescriberId] = useState<number | null>(null);
    const [deadline, setDeadline] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        if (!describerId || !deadline) return;

        setLoading(true);
        const success = await TaskStore.assignDescriber(taskId, {
            describer_id: describerId,
            deadline: deadline.format("YYYY-MM-DDTHH:mm:ssZ"),
        });
        setLoading(false);

        if (success) {
            message.success("Описатель назначен");
            setDescriberId(null);
            setDeadline(null);
            onSuccess();
            onClose();
        } else {
            message.error("Ошибка при назначении описателя");
        }
    };

    return (
        <Modal
            title="Назначить описателя"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            okText="Назначить"
            cancelText="Отмена"
            confirmLoading={loading}
            okButtonProps={{disabled: !describerId || !deadline}}
        >
            <Form layout="vertical">
                <Form.Item label="ID студента-описателя">
                    <InputNumber
                        value={describerId}
                        onChange={setDescriberId}
                        placeholder="ID студента"
                        style={{width: "100%"}}
                        min={1}
                    />
                </Form.Item>
                <Form.Item label="Дедлайн описания">
                    <DatePicker
                        showTime
                        value={deadline}
                        onChange={setDeadline}
                        style={{width: "100%"}}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
});
