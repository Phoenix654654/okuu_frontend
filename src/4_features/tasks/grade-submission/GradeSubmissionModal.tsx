import {useState} from "react";
import {Modal, Form, InputNumber, Input, message} from "antd";
import {observer} from "mobx-react-lite";
import {TaskStore} from "@/5_entities/task";

interface GradeSubmissionModalProps {
    open: boolean;
    submissionId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export const GradeSubmissionModal = observer(({open, submissionId, onClose, onSuccess}: GradeSubmissionModalProps) => {
    const [score, setScore] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        if (!score) return;

        setLoading(true);
        const success = await TaskStore.gradeSubmission(submissionId, {
            score,
            comment: comment.trim(),
        });
        setLoading(false);

        if (success) {
            message.success("Оценка выставлена");
            setScore(null);
            setComment("");
            onSuccess();
            onClose();
        } else {
            message.error("Ошибка при оценивании");
        }
    };

    return (
        <Modal
            title="Оценить решение"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            okText="Оценить"
            cancelText="Отмена"
            confirmLoading={loading}
            okButtonProps={{disabled: !score}}
        >
            <Form layout="vertical">
                <Form.Item label="Оценка (1-5)">
                    <InputNumber
                        value={score}
                        onChange={setScore}
                        min={1}
                        max={5}
                        style={{width: "100%"}}
                    />
                </Form.Item>
                <Form.Item label="Комментарий">
                    <Input.TextArea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Комментарий к оценке"
                        rows={3}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
});
