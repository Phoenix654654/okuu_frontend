import {useEffect, useState} from "react";
import {Card, Tag, Table, Button, Space, Spin, Descriptions, message, Popconfirm} from "antd";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import type {DescriptionStatus, AssignmentStatus, ITaskDescriptionInline, ITaskAssignmentInline, ISubmission, IFile} from "@/5_entities/task";
import {AssignDescriberModal, ReviewDescriptionModal, PublishTaskModal, GradeSubmissionModal} from "@/4_features/tasks";
import {routes, taskStatusLabels, taskStatusColors, descriptionStatusLabels, assignmentStatusLabels} from "@/6_shared";
import cls from "./TaskDetailPage.module.scss";

const TaskDetailPage = observer(() => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const task = TaskStore.current$.value;
    const loading = TaskStore.current$.loading;

    const [assignDescriberOpen, setAssignDescriberOpen] = useState(false);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewDescId, setReviewDescId] = useState<number>(0);
    const [publishOpen, setPublishOpen] = useState(false);
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

    const handleClose = async () => {
        if (!id) return;
        const success = await TaskStore.closeTask(Number(id));
        if (success) {
            message.success("Задание закрыто");
            reload();
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        const success = await TaskStore.deleteTask(Number(id));
        if (success) {
            message.success("Задание удалено");
            navigate(routes.tasks);
        }
    };

    if (loading || !task) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    const descriptionColumns = [
        {
            title: "Описание",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Файлы",
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
                ) : "—",
        },
        {
            title: "Действия",
            key: "actions",
            render: (_: unknown, r: ITaskDescriptionInline) =>
                r.status === "submitted" ? (
                    <Button
                        size="small"
                        onClick={() => {
                            setReviewDescId(r.id);
                            setReviewOpen(true);
                        }}
                    >
                        Проверить
                    </Button>
                ) : null,
        },
    ];

    const assignmentColumns = [
        {
            title: "Студент",
            key: "student",
            render: (_: unknown, r: ITaskAssignmentInline) => r.student?.full_name || "—",
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (s: AssignmentStatus) => <Tag>{assignmentStatusLabels[s]}</Tag>,
        },
        {
            title: "Решение",
            dataIndex: "has_submission",
            key: "has_submission",
            render: (has: boolean) => has ? <Tag color="green">Есть</Tag> : <Tag>Нет</Tag>,
        },
        {
            title: "Оценка",
            dataIndex: "score",
            key: "score",
            render: (score: number | null) => score !== null ? <Tag color="green">{score}/5</Tag> : "—",
        },
    ];

    const submissionColumns = [
        {
            title: "Студент",
            key: "student",
            render: (_: unknown, r: ISubmission) => r.student || `#${r.id}`,
        },
        {
            title: "Задание",
            dataIndex: "task_title",
            key: "task_title",
            ellipsis: true,
        },
        {
            title: "Отправлено",
            dataIndex: "submitted_at",
            key: "submitted_at",
            render: (date: string) => date ? new Date(date).toLocaleString("ru-RU") : "—",
        },
        {
            title: "Оценка",
            dataIndex: "score",
            key: "score",
            render: (score: number | null) => score !== null ? <Tag color="green">{score}/5</Tag> : "—",
        },
        {
            title: "Действия",
            key: "actions",
            render: (_: unknown, r: ISubmission) =>
                r.score === null ? (
                    <Button
                        size="small"
                        onClick={() => {
                            setGradeSubId(r.id);
                            setGradeOpen(true);
                        }}
                    >
                        Оценить
                    </Button>
                ) : null,
        },
    ];

    return (
        <div className={cls.page}>
            <div className={cls.header}>
                <h1>{task.title}</h1>
                <Space>
                    {task.status === "draft" && (
                        <Button type="primary" onClick={() => setAssignDescriberOpen(true)}>
                            Назначить описателя
                        </Button>
                    )}
                    {task.status === "review" && (
                        <Button type="primary" onClick={() => setPublishOpen(true)}>
                            Опубликовать
                        </Button>
                    )}
                    {task.status === "published" && (
                        <Popconfirm title="Закрыть задание?" onConfirm={handleClose} okText="Да" cancelText="Нет">
                            <Button>Закрыть задание</Button>
                        </Popconfirm>
                    )}
                    {task.status === "draft" && (
                        <Popconfirm title="Удалить задание?" onConfirm={handleDelete} okText="Да" cancelText="Нет">
                            <Button danger>Удалить</Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>

            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Преподаватель">{task.teacher?.full_name || "—"}</Descriptions.Item>
                <Descriptions.Item label="Статус">
                    <Tag color={taskStatusColors[task.status]}>{taskStatusLabels[task.status]}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Создано">
                    {new Date(task.created_at).toLocaleDateString("ru-RU")}
                </Descriptions.Item>
                <Descriptions.Item label="Обновлено">
                    {new Date(task.updated_at).toLocaleDateString("ru-RU")}
                </Descriptions.Item>
            </Descriptions>

            {task.description && (
                <Card title="Описание задания" size="small">
                    <p style={{whiteSpace: "pre-wrap"}}>{task.description}</p>
                </Card>
            )}

            {task.files && task.files.length > 0 && (
                <Card title="Файлы задания" size="small">
                    <Space direction="vertical" size={4}>
                        {task.files.map((f: IFile) => (
                            <a key={f.id} href={f.file} target="_blank" rel="noopener noreferrer">
                                {f.original_name}
                            </a>
                        ))}
                    </Space>
                </Card>
            )}

            {task.approved_description && (
                <Card title="Одобренное описание" size="small">
                    <p style={{whiteSpace: "pre-wrap"}}>
                        {typeof task.approved_description === "string"
                            ? task.approved_description
                            : (task.approved_description as any).description || "—"}
                    </p>
                </Card>
            )}

            {task.descriptions && task.descriptions.length > 0 && (
                <Card title="Описания" size="small">
                    <Table
                        dataSource={task.descriptions}
                        columns={descriptionColumns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </Card>
            )}

            {task.assignments && task.assignments.length > 0 && (
                <Card title="Назначения" size="small">
                    <Table
                        dataSource={task.assignments}
                        columns={assignmentColumns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </Card>
            )}

            {TaskStore.submissions$.items.length > 0 && (
                <Card title="Решения" size="small">
                    <Table
                        dataSource={TaskStore.submissions$.items}
                        columns={submissionColumns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </Card>
            )}

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
            <PublishTaskModal
                open={publishOpen}
                taskId={task.id}
                onClose={() => setPublishOpen(false)}
                onSuccess={reload}
            />
            <GradeSubmissionModal
                open={gradeOpen}
                submissionId={gradeSubId}
                onClose={() => setGradeOpen(false)}
                onSuccess={reload}
            />
        </div>
    );
});

export default TaskDetailPage;
