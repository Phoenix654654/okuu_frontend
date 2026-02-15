import {useState} from "react";
import {Modal, Form, Switch, Input, message} from "antd";
import {observer} from "mobx-react-lite";
import {TaskStore} from "@/5_entities/task";
import {AppInput} from "@/6_shared/ui/input/AppInput";

interface CreateTaskModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    defaultGroupId?: number;
}

export const CreateTaskModal = observer(({open, onClose, onSuccess}: CreateTaskModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isShared, setIsShared] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        if (!title.trim()) return;

        setLoading(true);
        const success = await TaskStore.createTask({
            title: title.trim(),
            description,
            is_shared: isShared,
            file_ids: [],
        });
        setLoading(false);

        if (success) {
            message.success("Задание создано");
            setTitle("");
            setDescription("");
            setIsShared(false);
            onSuccess();
            onClose();
        } else {
            message.error("Ошибка при создании задания");
        }
    };

    return (
        <Modal
            title="Создать задание"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            okText="Создать"
            cancelText="Отмена"
            confirmLoading={loading}
            okButtonProps={{disabled: !title.trim()}}
        >
            <Form layout="vertical">
                <Form.Item label="Заголовок">
                    <AppInput
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название задания"
                    />
                </Form.Item>
                <Form.Item label="Описание">
                    <Input.TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Описание задания"
                        rows={3}
                    />
                </Form.Item>
                <Form.Item label="Общая задача">
                    <Switch
                        checked={isShared}
                        onChange={setIsShared}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
});
