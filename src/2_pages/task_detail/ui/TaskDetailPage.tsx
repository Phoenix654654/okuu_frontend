import {useEffect, useState} from "react";
import {Card, Tag, Table, Button, Space, Spin, Descriptions, message, Popconfirm, List} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import {UserStore} from "@/5_entities/user";
import type {AssignmentStatus, ITaskDescriptionInline, ITaskAssignmentInline, ISubmission, IFile} from "@/5_entities/task";
import {AssignDescriberModal, ReviewDescriptionModal, GradeSubmissionModal} from "@/4_features/tasks";
import {routes, getAssignmentStatusLabels} from "@/6_shared";
import {useMediaQuery} from "@/6_shared/lib/hooks/useMediaQuery/useMediaQuery";
import {useTranslation} from "react-i18next";
import cls from "./TaskDetailPage.module.scss";

const TaskDetailPage = observer(() => {
    const {t} = useTranslation("taskDetail");
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const task = TaskStore.current$.value;
    const loading = TaskStore.current$.loading;
    const canManageTask = UserStore.currentUser$.value?.role === "Teacher";
    const assignmentStatusLabels = getAssignmentStatusLabels();
    const isMobile = useMediaQuery("(max-width: 900px)");
    const isPhone = useMediaQuery("(max-width: 700px)");

    const [assignDescriberOpen, setAssignDescriberOpen] = useState(false);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewDescId, setReviewDescId] = useState<number>(0);
    const [gradeOpen, setGradeOpen] = useState(false);
    const [gradeSubId, setGradeSubId] = useState<number>(0);

    useEffect(() => {
        if (id) {
            TaskStore.fetchTask(Number(id));
            TaskStore.submissions$.setFilter("task_id", Number(id));
            TaskStore.fetchSubmissions();
        }
        return () => {
            TaskStore.current$.clear();
        };
    }, [id]);

    const reload = () => {
        if (id) {
            TaskStore.fetchTask(Number(id));
            TaskStore.fetchSubmissions();
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        const success = await TaskStore.deleteTask(Number(id));
        if (success) {
            message.success(t("messages.deleted"));
            navigate(routes.tasks);
        }
    };

    if (loading || !task) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    const selectedDescriptionText =
        typeof task.selected_description === "string"
            ? task.selected_description
            : task.selected_description?.description;

    const descriptionColumns = [
        {
            title: t("table.description"),
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: t("table.files"),
            key: "files",
            render: (_: unknown, r: ITaskDescriptionInline) =>
                r.files && r.files.length > 0 ? (
                    <Space direction="vertical" size={2}>
                        {r.files.map((f: IFile) => (
                            <a key={f.id} href={f.file} target="_blank" rel="noopener noreferrer">
                                {f.original_name}
                            </a>
                        ))}
                    </Space>
                ) : "-",
        },
        {
            title: t("table.student"),
            key: "student",
            render: (_: unknown, r: ITaskDescriptionInline) => r.describer?.student_code || "-",
        },
        {
            title: t("table.actions"),
            key: "actions",
            render: (_: unknown, r: ITaskDescriptionInline) =>
                canManageTask && r.status === "submitted" ? (
                    <Button
                        size="small"
                        onClick={() => {
                            setReviewDescId(r.id);
                            setReviewOpen(true);
                        }}
                    >
                        {t("buttons.review")}
                    </Button>
                ) : null,
        },
    ];

    const assignmentColumns = [
        {
            title: t("table.student"),
            key: "student",
            render: (_: unknown, r: ITaskAssignmentInline) => r.student?.full_name || "-",
        },
        {
            title: t("table.status"),
            dataIndex: "status",
            key: "status",
            render: (s: AssignmentStatus) => <Tag>{assignmentStatusLabels[s]}</Tag>,
        },
        {
            title: t("table.solution"),
            dataIndex: "has_submission",
            key: "has_submission",
            render: (has: boolean) => has ? <Tag color="green">{t("values.yes")}</Tag> : <Tag>{t("values.no")}</Tag>,
        },
        {
            title: t("table.score"),
            dataIndex: "score",
            key: "score",
            render: (score: number | null) => score !== null ? <Tag color="green">{score}/5</Tag> : "-",
        },
    ];

    const submissionColumns = [
        {
            title: t("table.student"),
            key: "student",
            render: (_: unknown, r: ISubmission) => r.student || `#${r.id}`,
        },
        {
            title: t("table.task"),
            dataIndex: "task_title",
            key: "task_title",
            ellipsis: true,
        },
        {
            title: t("table.submittedAt"),
            dataIndex: "submitted_at",
            key: "submitted_at",
            render: (date: string) => date ? new Date(date).toLocaleString("ru-RU") : "-",
        },
        {
            title: t("table.score"),
            dataIndex: "score",
            key: "score",
            render: (score: number | null) => score !== null ? <Tag color="green">{score}/5</Tag> : "-",
        },
        {
            title: t("table.actions"),
            key: "actions",
            render: (_: unknown, r: ISubmission) =>
                canManageTask && r.score === null ? (
                    <Button
                        size="small"
                        onClick={() => {
                            setGradeSubId(r.id);
                            setGradeOpen(true);
                        }}
                    >
                        {t("buttons.grade")}
                    </Button>
                ) : null,
        },
    ];

    return (
        <div className={cls.page}>
            <button className={cls.backBtn} onClick={() => navigate(routes.tasks)}>
                <ArrowLeftOutlined /> {t("back")}
            </button>

            <div className={cls.header}>
                <h1>{task.title}</h1>
                <Space>
                    {canManageTask && (
                        <Button type="primary" onClick={() => setAssignDescriberOpen(true)}>
                            {t("buttons.assignDescriber")}
                        </Button>
                    )}
                    {canManageTask && (
                        <Popconfirm
                            title={t("confirm.deleteTask")}
                            onConfirm={handleDelete}
                            okText={t("confirm.yes")}
                            cancelText={t("confirm.no")}
                        >
                            <Button danger>{t("buttons.delete")}</Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>

            <Descriptions bordered size="small" column={isMobile ? 1 : 2}>
                <Descriptions.Item label={t("labels.teacher")}>{task.teacher?.full_name || "-"}</Descriptions.Item>
                <Descriptions.Item label={t("labels.createdAt")}>
                    {new Date(task.created_at).toLocaleDateString("ru-RU")}
                </Descriptions.Item>
                <Descriptions.Item label={t("labels.updatedAt")}>
                    {new Date(task.updated_at).toLocaleDateString("ru-RU")}
                </Descriptions.Item>
            </Descriptions>

            {task.description && (
                <Card title={t("cards.taskDescription")} size="small">
                    <p style={{whiteSpace: "pre-wrap"}}>{task.description}</p>
                </Card>
            )}

            {task.files && task.files.length > 0 && (
                <Card title={t("cards.taskFiles")} size="small">
                    <Space direction="vertical" size={4}>
                        {task.files.map((f: IFile) => (
                            <a key={f.id} href={f.file} target="_blank" rel="noopener noreferrer">
                                {f.original_name}
                            </a>
                        ))}
                    </Space>
                </Card>
            )}

            {selectedDescriptionText && (
                <Card title={t("cards.selectedDescription")} size="small">
                    <p style={{whiteSpace: "pre-wrap"}}>{selectedDescriptionText}</p>
                </Card>
            )}

            {task.descriptions && task.descriptions.length > 0 && (
                <Card title={t("cards.descriptions")} size="small">
                    {isPhone ? (
                        <List
                            className={cls.cardList}
                            dataSource={task.descriptions}
                            renderItem={(r: ITaskDescriptionInline) => (
                                <List.Item className={cls.cardListItem}>
                                    <Card size="small" className={cls.itemCard}>
                                        <div className={cls.itemMeta}>
                                            <div className={cls.metaLine}>
                                                <span className={cls.metaLabel}>{t("table.student")}:</span>
                                                <span className={cls.metaValue}>{r.describer?.student_code || "-"}</span>
                                            </div>
                                            {r.files && r.files.length > 0 && (
                                                <div className={cls.metaLine}>
                                                    <span className={cls.metaLabel}>{t("table.files")}:</span>
                                                    <span className={cls.filesValue}>
                                                        {r.files.map((f: IFile) => (
                                                            <a
                                                                key={f.id}
                                                                className={cls.fileLink}
                                                                href={f.file}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {f.original_name}
                                                            </a>
                                                        ))}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className={cls.preview} title={r.description}>
                                            <span className={cls.previewLabel}>{t("table.description")}:</span>{" "}
                                            <span>{r.description || "-"}</span>
                                        </div>
                                        {canManageTask && r.status === "submitted" && (
                                            <div className={cls.itemActions}>
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        setReviewDescId(r.id);
                                                        setReviewOpen(true);
                                                    }}
                                                >
                                                    {t("buttons.review")}
                                                </Button>
                                            </div>
                                        )}
                                    </Card>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Table
                            dataSource={task.descriptions}
                            columns={descriptionColumns}
                            rowKey="id"
                            pagination={false}
                            scroll={{x: "max-content"}}
                            size="small"
                        />
                    )}
                </Card>
            )}

            {task.assignments && task.assignments.length > 0 && (
                <Card title={t("cards.assignments")} size="small">
                    {isPhone ? (
                        <List
                            className={cls.cardList}
                            dataSource={task.assignments}
                            renderItem={(r: ITaskAssignmentInline) => {
                                const hasSubmission = ["true", "1"].includes(String(r.has_submission));
                                const scoreText =
                                    r.score !== null && r.score !== undefined && String(r.score).trim() !== ""
                                        ? `${r.score}/5`
                                        : "-";

                                return (
                                    <List.Item className={cls.cardListItem}>
                                        <Card size="small" className={cls.itemCard}>
                                            <div className={cls.itemMeta}>
                                                <div className={cls.metaLine}>
                                                    <span className={cls.metaLabel}>{t("table.student")}:</span>
                                                    <span className={cls.metaValue}>{r.student?.full_name || "-"}</span>
                                                </div>
                                                <div className={cls.metaLine}>
                                                    <span className={cls.metaLabel}>{t("table.status")}:</span>
                                                    <span className={cls.metaValue}>
                                                        <Tag>{assignmentStatusLabels[r.status]}</Tag>
                                                    </span>
                                                </div>
                                                <div className={cls.metaLine}>
                                                    <span className={cls.metaLabel}>{t("table.solution")}:</span>
                                                    <span className={cls.metaValue}>
                                                        {hasSubmission ? (
                                                            <Tag color="green">{t("values.yes")}</Tag>
                                                        ) : (
                                                            <Tag>{t("values.no")}</Tag>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className={cls.metaLine}>
                                                    <span className={cls.metaLabel}>{t("table.score")}:</span>
                                                    <span className={cls.metaValue}>
                                                        {scoreText === "-" ? "-" : <Tag color="green">{scoreText}</Tag>}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    </List.Item>
                                );
                            }}
                        />
                    ) : (
                        <Table
                            dataSource={task.assignments}
                            columns={assignmentColumns}
                            rowKey="id"
                            pagination={false}
                            scroll={{x: "max-content"}}
                            size="small"
                        />
                    )}
                </Card>
            )}

            {TaskStore.submissions$.items.length > 0 && (
                <Card title={t("cards.submissions")} size="small">
                    {isPhone ? (
                        <List
                            className={cls.cardList}
                            dataSource={TaskStore.submissions$.items}
                            renderItem={(r: ISubmission) => (
                                <List.Item className={cls.cardListItem}>
                                    <Card size="small" className={cls.itemCard}>
                                        <div className={cls.itemMeta}>
                                            <div className={cls.metaLine}>
                                                <span className={cls.metaLabel}>{t("table.student")}:</span>
                                                <span className={cls.metaValue}>{r.student || `#${r.id}`}</span>
                                            </div>
                                            <div className={cls.metaLine}>
                                                <span className={cls.metaLabel}>{t("table.submittedAt")}:</span>
                                                <span className={cls.metaValue}>
                                                    {r.submitted_at ? new Date(r.submitted_at).toLocaleString("ru-RU") : "-"}
                                                </span>
                                            </div>
                                            <div className={cls.metaLine}>
                                                <span className={cls.metaLabel}>{t("table.score")}:</span>
                                                <span className={cls.metaValue}>
                                                    {r.score !== null ? <Tag color="green">{r.score}/5</Tag> : "-"}
                                                </span>
                                            </div>
                                        </div>
                                        {canManageTask && r.score === null && (
                                            <div className={cls.itemActions}>
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        setGradeSubId(r.id);
                                                        setGradeOpen(true);
                                                    }}
                                                >
                                                    {t("buttons.grade")}
                                                </Button>
                                            </div>
                                        )}
                                    </Card>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Table
                            dataSource={TaskStore.submissions$.items}
                            columns={submissionColumns}
                            rowKey="id"
                            pagination={false}
                            scroll={{x: "max-content"}}
                            size="small"
                        />
                    )}
                </Card>
            )}

            {canManageTask && (
                <>
                    <AssignDescriberModal
                        open={assignDescriberOpen}
                        taskId={task.id}
                        onClose={() => setAssignDescriberOpen(false)}
                        onSuccess={reload}
                    />
                    <ReviewDescriptionModal
                        open={reviewOpen}
                        taskId={task.id}
                        descriptionId={reviewDescId}
                        onClose={() => setReviewOpen(false)}
                        onSuccess={reload}
                    />
                    <GradeSubmissionModal
                        open={gradeOpen}
                        submissionId={gradeSubId}
                        onClose={() => setGradeOpen(false)}
                        onSuccess={reload}
                    />
                </>
            )}
        </div>
    );
});

export default TaskDetailPage;
