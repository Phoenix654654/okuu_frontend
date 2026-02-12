import {useState} from "react";
import {Modal, InputNumber, message, Tag, Space, Button} from "antd";
import {observer} from "mobx-react-lite";
import {TaskStore} from "@/5_entities/task";

interface PublishTaskModalProps {
    open: boolean;
    taskId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export const PublishTaskModal = observer(({open, taskId, onClose, onSuccess}: PublishTaskModalProps) => {
    const [studentIds, setStudentIds] = useState<number[]>([]);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const addStudent = () => {
        if (currentId && !studentIds.includes(currentId)) {
            setStudentIds([...studentIds, currentId]);
            setCurrentId(null);
        }
    };

    const removeStudent = (id: number) => {
        setStudentIds(studentIds.filter(sid => sid !== id));
    };

    const handlePublish = async () => {
        if (studentIds.length === 0) {
            message.warning("Добавьте хотя бы одного студента");
            return;
        }

        setLoading(true);
        const success = await TaskStore.publishTask(taskId, {student_ids: studentIds});
        setLoading(false);

        if (success) {
            message.success("Задание опубликовано");
            setStudentIds([]);
            onSuccess();
            onClose();
        } else {
            message.error("Ошибка при публикации");
        }
    };

    return (
        <Modal
            title="Опубликовать задание"
            open={open}
            onOk={handlePublish}
            onCancel={onClose}
            okText="Опубликовать"
            cancelText="Отмена"
            confirmLoading={loading}
        >
            <div style={{marginBottom: 12}}>
                <Space>
                    <InputNumber
                        value={currentId}
                        onChange={setCurrentId}
                        placeholder="ID студента"
                        min={1}
                    />
                    <Button onClick={addStudent} disabled={!currentId}>
                        Добавить
                    </Button>
                </Space>
            </div>
            <div>
                {studentIds.map(id => (
                    <Tag
                        key={id}
                        closable
                        onClose={() => removeStudent(id)}
                        style={{marginBottom: 4}}
                    >
                        Студент #{id}
                    </Tag>
                ))}
                {studentIds.length === 0 && (
                    <span style={{color: "#9e9e9e"}}>Добавьте студентов для назначения</span>
                )}
            </div>
        </Modal>
    );
});
