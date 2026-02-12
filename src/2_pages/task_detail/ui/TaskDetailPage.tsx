import {useEffect, useState} from "react";
import {Card, Tag, Table, Button, Space, Spin, Descriptions, message, Popconfirm} from "antd";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import type {DescriptionStatus, AssignmentStatus, ITaskDescription, ITaskAssignment, ISubmission} from "@/5_entities/task";
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
            title: "Описатель",
            key: "describer",
            render: (_: unknown, r: ITaskDescription) => r.describer?.full_name || "—",
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (s: DescriptionStatus) => <Tag>{descriptionStatusLabels[s]}</Tag>,
        },
        {
            title: "Описание",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Действия",
            key: "actions",
            render: (_: unknown, r: ITaskDescription) =>
                r.status === "SUBMITTED" ? (
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
            render: (_: unknown, r: ITaskAssignment) => r.student?.full_name || "—",
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (s: AssignmentStatus) => <Tag>{assignmentStatusLabels[s]}</Tag>,
        },
    ];

    const submissionColumns = [
        {
            title: "Студент",
            key: "student",
            render: (_: unknown, r: ISubmission) => r.student?.full_name || `#${r.assignment}`,
        },
        {
            title: "Содержание",
            dataIndex: "content",
            key: "content",
            ellipsis: true,
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
                    {task.status === "DRAFT" && (
                        <Button type="primary" onClick={() => setAssignDescriberOpen(true)}>
                            Назначить описателя
                        </Button>
                    )}
                    {task.status === "REVIEW" && (
                        <Button type="primary" onClick={() => setPublishOpen(true)}>
                            Опубликовать
                        </Button>
                    )}
                    {task.status === "PUBLISHED" && (
                        <Popconfirm title="Закрыть задание?" onConfirm={handleClose} okText="Да" cancelText="Нет">
                            <Button>Закрыть задание</Button>
                        </Popconfirm>
                    )}
                    {task.status === "DRAFT" && (
                        <Popconfirm title="Удалить задание?" onConfirm={handleDelete} okText="Да" cancelText="Нет">
                            <Button danger>Удалить</Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>

            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Группа">{task.group?.name || "—"}</Descriptions.Item>
                <Descriptions.Item label="Статус">
                    <Tag color={taskStatusColors[task.status]}>{taskStatusLabels[task.status]}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Дедлайн">
                    {task.deadline ? new Date(task.deadline).toLocaleString("ru-RU") : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Создано">
                    {new Date(task.created_at).toLocaleDateString("ru-RU")}
                </Descriptions.Item>
            </Descriptions>

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
