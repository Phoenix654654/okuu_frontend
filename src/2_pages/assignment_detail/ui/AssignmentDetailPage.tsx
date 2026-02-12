import {useEffect, useState} from "react";
import {Card, Tag, Spin, Input, Descriptions, message} from "antd";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import type {AssignmentStatus} from "@/5_entities/task";
import {FileUpload} from "@/4_features/file-upload/FileUpload";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import {routes} from "@/6_shared";
import cls from "./AssignmentDetailPage.module.scss";

const statusLabels: Record<AssignmentStatus, string> = {
    PENDING: "Ожидает решения",
    SUBMITTED: "Отправлено",
    GRADED: "Оценено",
};

const AssignmentDetailPage = observer(() => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const assignment = TaskStore.currentAssignment$.value;
    const loading = TaskStore.currentAssignment$.loading;

    const [content, setContent] = useState("");
    const [fileIds, setFileIds] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const canSubmit = assignment?.status === "PENDING";

    useEffect(() => {
        if (id) {
            TaskStore.fetchAssignment(Number(id));
        }
        return () => {
            TaskStore.currentAssignment$.clear();
        };
    }, [id]);

    const handleSubmit = async () => {
        if (!id || !content.trim()) return;

        setSubmitting(true);
        const success = await TaskStore.submitSolution(Number(id), {
            content: content.trim(),
            file_ids: fileIds,
        });
        setSubmitting(false);

        if (success) {
            message.success("Решение отправлено");
            navigate(routes.assignments);
        } else {
            message.error("Ошибка при отправке");
        }
    };

    if (loading || !assignment) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    return (
        <div className={cls.page}>
            <h1>Задание #{assignment.task}</h1>

            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Статус">
                    <Tag>{statusLabels[assignment.status]}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Дата назначения">
                    {new Date(assignment.created_at).toLocaleString("ru-RU")}
                </Descriptions.Item>
            </Descriptions>

            {canSubmit ? (
                <Card title="Отправить решение" size="small">
                    <div className={cls.form}>
                        <Input.TextArea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Введите ваше решение..."
                            rows={6}
                        />
                        <FileUpload fileIds={fileIds} onChange={setFileIds} />
                        <div className={cls.actions}>
                            <AppButton
                                type="primary"
                                loading={submitting}
                                disabled={!content.trim()}
                                onClick={handleSubmit}
                            >
                                Отправить решение
                            </AppButton>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card title="Решение отправлено" size="small">
                    <p>Ваше решение было отправлено и ожидает проверки преподавателем.</p>
                </Card>
            )}
        </div>
    );
});

export default AssignmentDetailPage;
