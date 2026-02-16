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
    pending: "Ожидает решения",
    submitted: "Отправлено",
    graded: "Оценено",
};

const AssignmentDetailPage = observer(() => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const assignment = TaskStore.currentAssignment$.value;
    const loading = TaskStore.currentAssignment$.loading;

    const [content, setContent] = useState("");
    const [fileIds, setFileIds] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const canSubmit = assignment?.status === "pending";

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

    const task = assignment.task;
    const submission = assignment.submission;

    return (
        <div className={cls.page}>
            <h1>{task?.title || `Задание #${assignment.id}`}</h1>

            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Статус">
                    <Tag>{statusLabels[assignment.status]}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Дата назначения">
                    {new Date(assignment.created_at).toLocaleString("ru-RU")}
                </Descriptions.Item>
                {assignment.deadline && (
                    <Descriptions.Item label="Дедлайн">
                        {new Date(assignment.deadline).toLocaleString("ru-RU")}
                    </Descriptions.Item>
                )}
            </Descriptions>

            {task?.approved_description && (
                <Card title="Описание задания" size="small">
                    <p style={{whiteSpace: "pre-wrap"}}>
                        {typeof task.approved_description === "string"
                            ? task.approved_description
                            : (task.approved_description as any).description || "—"}
                    </p>
                </Card>
            )}

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
            ) : submission ? (
                <Card title="Ваше решение" size="small">
                    <p style={{whiteSpace: "pre-wrap"}}>{submission.content}</p>
                    {submission.files && submission.files.length > 0 && (
                        <div style={{marginTop: 8}}>
                            <strong>Файлы:</strong>
                            {submission.files.map(f => (
                                <div key={f.id}>
                                    <a href={f.file} target="_blank" rel="noopener noreferrer">{f.original_name}</a>
                                </div>
                            ))}
                        </div>
                    )}
                    {submission.score !== null && (
                        <Descriptions bordered size="small" column={1} style={{marginTop: 16}}>
                            <Descriptions.Item label="Оценка">
                                <Tag color="green">{submission.score}/5</Tag>
                            </Descriptions.Item>
                            {submission.teacher_comment && (
                                <Descriptions.Item label="Комментарий преподавателя">
                                    {submission.teacher_comment}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    )}
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
