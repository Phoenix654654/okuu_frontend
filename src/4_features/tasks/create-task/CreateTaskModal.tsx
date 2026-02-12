import {useState} from "react";
import {Modal, Form, DatePicker, Select, message} from "antd";
import type {Dayjs} from "dayjs";
import {observer} from "mobx-react-lite";
import {TaskStore} from "@/5_entities/task";
import {GroupStore} from "@/5_entities/group";
import {AppInput} from "@/6_shared/ui/input/AppInput";

interface CreateTaskModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateTaskModal = observer(({open, onClose, onSuccess}: CreateTaskModalProps) => {
    const [title, setTitle] = useState("");
    const [groupId, setGroupId] = useState<number | undefined>();
    const [deadline, setDeadline] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);

    const groups = GroupStore.list$.items;

    const handleOk = async () => {
        if (!title.trim() || !groupId || !deadline) return;

        setLoading(true);
        const success = await TaskStore.createTask({
            group: groupId,
            title: title.trim(),
            deadline: deadline.format("YYYY-MM-DDTHH:mm:ssZ"),
        });
        setLoading(false);

        if (success) {
            message.success("Задание создано");
            setTitle("");
            setGroupId(undefined);
            setDeadline(null);
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
            okButtonProps={{disabled: !title.trim() || !groupId || !deadline}}
        >
            <Form layout="vertical">
                <Form.Item label="Группа">
                    <Select
                        value={groupId}
                        onChange={setGroupId}
                        placeholder="Выберите группу"
                        options={groups.map(g => ({value: g.id, label: g.name}))}
                    />
                </Form.Item>
                <Form.Item label="Заголовок">
                    <AppInput
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название задания"
                    />
                </Form.Item>
                <Form.Item label="Дедлайн">
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
