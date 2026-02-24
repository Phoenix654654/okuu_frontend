import {useEffect, useState} from "react";
import {Card, Tag, Spin, Input, Descriptions, Alert, message} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import {FileUpload} from "@/4_features/file-upload/FileUpload";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import {routes, descriptionStatusLabels, descriptionStatusColors} from "@/6_shared";
import cls from "./DescriptionDetailPage.module.scss";

const DescriptionDetailPage = observer(() => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const desc = TaskStore.currentDescription$.value;
    const loading = TaskStore.currentDescription$.loading;

    const [text, setText] = useState("");
    const [fileIds, setFileIds] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const canSubmit = desc?.status === "pending" || desc?.status === "revision";

    useEffect(() => {
        if (id) {
            TaskStore.fetchDescription(Number(id));
        }
        return () => {
            TaskStore.currentDescription$.clear();
        };
    }, [id]);

    useEffect(() => {
        if (desc?.description) {
            setText(desc.description);
        }
    }, [desc]);

    const handleSubmit = async () => {
        if (!id || !text.trim()) return;

        setSubmitting(true);
        const success = await TaskStore.submitDescription(Number(id), {
            description: text.trim(),
            file_ids: fileIds,
        });
        setSubmitting(false);

        if (success) {
            message.success("Описание отправлено");
            navigate(routes.descriptions);
        } else {
            message.error("Ошибка при отправке");
        }
    };

    if (loading || !desc) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    return (
        <div className={cls.page}>
            <button className={cls.backBtn} onClick={() => navigate(routes.descriptions)}>
                <ArrowLeftOutlined /> Назад к списку
            </button>
            <h1>{desc.task?.title || `Описание задания #${desc.id}`}</h1>

            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Статус">
                    <Tag color={descriptionStatusColors[desc.status]}>
                        {descriptionStatusLabels[desc.status]}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Дедлайн">
                    {desc.deadline ? new Date(desc.deadline).toLocaleString("ru-RU") : "—"}
                </Descriptions.Item>
            </Descriptions>

            {desc.revision_comment && desc.status === "revision" && (
                <Alert
                    type="warning"
                    message="Комментарий преподавателя"
                    description={desc.revision_comment}
                    showIcon
                />
            )}

            {canSubmit ? (
                <Card title="Отправить описание" size="small">
                    <div className={cls.form}>
                        <Input.TextArea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Введите описание задания..."
                            rows={6}
                        />
                        <FileUpload fileIds={fileIds} onChange={setFileIds} />
                        <div className={cls.actions}>
                            <AppButton
                                type="primary"
                                loading={submitting}
                                disabled={!text.trim()}
                                onClick={handleSubmit}
                            >
                                Отправить
                            </AppButton>
                        </div>
                    </div>
                </Card>
            ) : (
                desc.description && (
                    <Card title="Описание" size="small">
                        <p>{desc.description}</p>
                        {desc.files && desc.files.length > 0 && (
                            <div>
                                <strong>Файлы:</strong>
                                {desc.files.map(f => (
                                    <div key={f.id}>
                                        <a href={f.file} target="_blank" rel="noopener noreferrer">{f.original_name}</a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                )
            )}
        </div>
    );
});

export default DescriptionDetailPage;
