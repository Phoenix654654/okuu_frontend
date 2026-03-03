import {useEffect, useState} from "react";
import {Card, Tag, Spin, Input, Descriptions, Alert, message} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import {FileUpload} from "@/4_features/file-upload/FileUpload";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import {routes, descriptionStatusColors, getDescriptionStatusLabels} from "@/6_shared";
import {useTranslation} from "react-i18next";
import cls from "./DescriptionDetailPage.module.scss";

const DescriptionDetailPage = observer(() => {
    const {t} = useTranslation("descriptionDetail");
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const desc = TaskStore.currentDescription$.value;
    const loading = TaskStore.currentDescription$.loading;
    const descriptionStatusLabels = getDescriptionStatusLabels();

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
            message.success(t("messages.sent"));
            navigate(routes.descriptions);
        } else {
            message.error(t("messages.error"));
        }
    };

    if (loading || !desc) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    return (
        <div className={cls.page}>
            <button className={cls.backBtn} onClick={() => navigate(routes.descriptions)}>
                <ArrowLeftOutlined /> {t("back")}
            </button>
            <h1>{desc.task?.title || t("titleFallback", {id: desc.id})}</h1>

            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label={t("labels.status")}>
                    <Tag color={descriptionStatusColors[desc.status]}>
                        {descriptionStatusLabels[desc.status]}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("labels.deadline")}>
                    {desc.deadline ? new Date(desc.deadline).toLocaleString("ru-RU") : "—"}
                </Descriptions.Item>
            </Descriptions>

            {desc.revision_comment && desc.status === "revision" && (
                <Alert
                    type="warning"
                    message={t("labels.teacherComment")}
                    description={desc.revision_comment}
                    showIcon
                />
            )}

            {canSubmit ? (
                <Card title={t("cards.sendDescription")} size="small">
                    <div className={cls.form}>
                        <Input.TextArea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={t("descriptionPlaceholder")}
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
                                {t("send")}
                            </AppButton>
                        </div>
                    </div>
                </Card>
            ) : (
                desc.description && (
                    <Card title={t("cards.description")} size="small">
                        <p>{desc.description}</p>
                        {desc.files && desc.files.length > 0 && (
                            <div>
                                <strong>{t("labels.files")}:</strong>
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
