import {useEffect, useState} from "react";
import {Card, Tag, Spin, Descriptions, InputNumber, Input, message} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import {routes} from "@/6_shared";
import cls from "./SubmissionDetailPage.module.scss";

const SubmissionDetailPage = observer(() => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const submission = TaskStore.currentSubmission$.value;
    const loading = TaskStore.currentSubmission$.loading;

    const [score, setScore] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [grading, setGrading] = useState(false);

    useEffect(() => {
        if (id) {
            TaskStore.fetchSubmission(Number(id));
        }
        return () => {
            TaskStore.currentSubmission$.clear();
        };
    }, [id]);

    const handleGrade = async () => {
        if (!id || !score) return;

        setGrading(true);
        const success = await TaskStore.gradeSubmission(Number(id), {
            score,
            comment: comment.trim(),
        });
        setGrading(false);

        if (success) {
            message.success("Оценка выставлена");
            navigate(routes.submissions);
        } else {
            message.error("Ошибка при оценивании");
        }
    };

    if (loading || !submission) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    const isGraded = submission.score !== null;

    return (
        <div className={cls.page}>
            <button className={cls.backBtn} onClick={() => navigate(routes.submissions)}>
                <ArrowLeftOutlined /> Назад к списку
            </button>
            <h1>{typeof submission.task === "object" ? (submission.task as any)?.title : submission.task || "Решение"}</h1>

            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Студент">
                    {typeof submission.student === "object"
                        ? (submission.student as any)?.full_name || "—"
                        : submission.student || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Дата отправки">
                    {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString("ru-RU") : "—"}
                </Descriptions.Item>
                {isGraded && (
                    <Descriptions.Item label="Оценка">
                        <Tag color="green">{submission.score}/5</Tag>
                    </Descriptions.Item>
                )}
                {submission.teacher_comment && (
                    <Descriptions.Item label="Комментарий преподавателя">
                        {submission.teacher_comment}
                    </Descriptions.Item>
                )}
            </Descriptions>

            <Card title="Решение студента" size="small">
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
            </Card>

            {!isGraded && (
                <Card title="Оценить решение" size="small">
                    <div className={cls.gradeForm}>
                        <div>
                            <label>Оценка (1-5)</label>
                            <InputNumber
                                value={score}
                                onChange={setScore}
                                min={1}
                                max={5}
                                style={{width: "100%", marginTop: 4}}
                            />
                        </div>
                        <div>
                            <label>Комментарий</label>
                            <Input.TextArea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Комментарий к оценке"
                                rows={3}
                                style={{marginTop: 4}}
                            />
                        </div>
                        <div className={cls.actions}>
                            <AppButton
                                type="primary"
                                loading={grading}
                                disabled={!score}
                                onClick={handleGrade}
                            >
                                Оценить
                            </AppButton>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
});

export default SubmissionDetailPage;
