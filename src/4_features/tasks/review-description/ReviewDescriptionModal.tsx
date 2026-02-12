import {useState} from "react";
import {Modal, Input, message, Space, Button} from "antd";
import {observer} from "mobx-react-lite";
import {TaskStore} from "@/5_entities/task";

interface ReviewDescriptionModalProps {
    open: boolean;
    taskId: number;
    descriptionId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export const ReviewDescriptionModal = observer(({open, taskId, descriptionId, onClose, onSuccess}: ReviewDescriptionModalProps) => {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        const success = await TaskStore.approveDescription(taskId, descriptionId);
        setLoading(false);

        if (success) {
            message.success("Описание одобрено");
            onSuccess();
            onClose();
        } else {
            message.error("Ошибка");
        }
    };

    const handleRevision = async () => {
        if (!comment.trim()) {
            message.warning("Укажите комментарий для доработки");
            return;
        }

        setLoading(true);
        const success = await TaskStore.revisionDescription(taskId, descriptionId, comment.trim());
        setLoading(false);

        if (success) {
            message.success("Описание отправлено на доработку");
            setComment("");
            onSuccess();
            onClose();
        } else {
            message.error("Ошибка");
        }
    };

    return (
        <Modal
            title="Проверка описания"
            open={open}
            onCancel={onClose}
            footer={
                <Space>
                    <Button onClick={onClose}>Отмена</Button>
                    <Button danger onClick={handleRevision} loading={loading}>
                        На доработку
                    </Button>
                    <Button type="primary" onClick={handleApprove} loading={loading}>
                        Одобрить
                    </Button>
                </Space>
            }
        >
            <Input.TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Комментарий (обязателен для доработки)"
                rows={4}
            />
        </Modal>
    );
});
