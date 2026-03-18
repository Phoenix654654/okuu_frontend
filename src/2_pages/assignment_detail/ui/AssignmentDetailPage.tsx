import {useEffect, useState} from "react";
import {Card, Tag, Spin, Input, Descriptions, message} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import type {AssignmentStatus} from "@/5_entities/task";
import {FileUpload} from "@/4_features/file-upload/FileUpload";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import {routes} from "@/6_shared";
import {useMediaQuery} from "@/6_shared/lib/hooks/useMediaQuery/useMediaQuery";
import {useTranslation} from "react-i18next";
import cls from "./AssignmentDetailPage.module.scss";

const AssignmentDetailPage = observer(() => {
    const {t} = useTranslation("assignmentDetail");
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const assignment = TaskStore.currentAssignment$.value;
    const loading = TaskStore.currentAssignment$.loading;
    const isMobile = useMediaQuery("(max-width: 900px)");

    const [content, setContent] = useState("");
    const [fileIds, setFileIds] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const statusLabels: Record<AssignmentStatus, string> = {
        pending: t("status.pending"),
        submitted: t("status.submitted"),
        graded: t("status.graded"),
    };

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
            message.success(t("messages.sent"));
            navigate(routes.assignments);
        } else {
            message.error(t("messages.error"));
        }
    };

    if (loading || !assignment) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    const task = assignment.task;
    const submission = assignment.submission;
    const selectedDescription = task?.selected_description ?? task?.approved_description;

    return (
        <div className={cls.page}>
            <button className={cls.backBtn} onClick={() => navigate(routes.assignments)}>
                <ArrowLeftOutlined /> {t("back")}
            </button>
            <h1>{task?.title || t("taskFallback", {id: assignment.id})}</h1>

            <Descriptions bordered size="small" column={isMobile ? 1 : 2}>
                <Descriptions.Item label={t("labels.status")}>
                    <Tag>{statusLabels[assignment.status]}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("labels.assignedAt")}>
                    {new Date(assignment.created_at).toLocaleString("ru-RU")}
                </Descriptions.Item>
                {assignment.deadline && (
                    <Descriptions.Item label={t("labels.deadline")}>
                        {new Date(assignment.deadline).toLocaleString("ru-RU")}
                    </Descriptions.Item>
                )}
            </Descriptions>

            {selectedDescription && (
                <Card title={t("cards.taskDescription")} size="small">
                    <p style={{whiteSpace: "pre-wrap"}}>
                        {typeof selectedDescription === "string"
                            ? selectedDescription
                            : selectedDescription.description || "—"}
                    </p>
                </Card>
            )}

            {canSubmit ? (
                <Card title={t("cards.sendSolution")} size="small">
                    <div className={cls.form}>
                        <Input.TextArea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t("solutionPlaceholder")}
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
                                {t("send")}
                            </AppButton>
                        </div>
                    </div>
                </Card>
            ) : submission ? (
                <Card title={t("cards.yourSolution")} size="small">
                    <p style={{whiteSpace: "pre-wrap"}}>{submission.content}</p>
                    {submission.files && submission.files.length > 0 && (
                        <div style={{marginTop: 8}}>
                            <strong>{t("labels.files")}:</strong>
                            {submission.files.map(f => (
                                <div key={f.id}>
                                    <a href={f.file} target="_blank" rel="noopener noreferrer">{f.original_name}</a>
                                </div>
                            ))}
                        </div>
                    )}
                    {submission.score !== null && (
                        <Descriptions bordered size="small" column={1} style={{marginTop: 16}}>
                            <Descriptions.Item label={t("labels.score")}>
                                <Tag color="green">{submission.score}/5</Tag>
                            </Descriptions.Item>
                            {submission.teacher_comment && (
                                <Descriptions.Item label={t("labels.teacherComment")}>
                                    {submission.teacher_comment}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    )}
                </Card>
            ) : (
                <Card title={t("cards.sent")} size="small">
                    <p>{t("sentInfo")}</p>
                </Card>
            )}
        </div>
    );
});

export default AssignmentDetailPage;
