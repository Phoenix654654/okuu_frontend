import {useEffect, useState} from "react";
import {Table, Button, Spin, Descriptions, Tag, Space, Select, message} from "antd";
import {ArrowLeftOutlined, EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {GroupStore} from "@/5_entities/group";
import {TaskStore} from "@/5_entities/task";
import {UserStore, userService} from "@/5_entities/user";
import type {IGroupStudent} from "@/5_entities/group";
import type {ITask} from "@/5_entities/task";
import {CreateTaskModal, AssignDescriberModal, PublishTaskModal} from "@/4_features/tasks";
import {routes, taskStatusLabels} from "@/6_shared";
import cls from "./GroupDetailPage.module.scss";

const GroupDetailPage = observer(() => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const group = GroupStore.current$.value;
    const loading = GroupStore.current$.loading;
    const role = UserStore.currentUser$.value?.role;
    const isAdmin = role === "Admin";
    const canManageTasks = role === "Teacher";

    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [assignDescriberOpen, setAssignDescriberOpen] = useState(false);
    const [publishOpen, setPublishOpen] = useState(false);
    const [students, setStudents] = useState<IGroupStudent[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            GroupStore.fetchGroup(Number(id));
            if (canManageTasks) {
                TaskStore.list$.setPageSize(50);
                TaskStore.fetchTasks();
            }
        }
        return () => {
            GroupStore.current$.clear();
            setStudents([]);
            setStudentsLoading(false);
        };
    }, [id, canManageTasks]);

    useEffect(() => {
        let cancelled = false;

        const loadStudents = async () => {
            if (!group || !id) return;
            if (group.id !== Number(id)) return;

            if (Array.isArray(group.students)) {
                setStudents(group.students);
                setStudentsLoading(false);
                return;
            }

            setStudentsLoading(true);
            try {
                const response = await userService.getUsers({
                    role: "Student",
                    group: Number(id),
                    limit: 200,
                    offset: 0,
                });

                if (cancelled) return;

                setStudents(
                    response.results.map((student) => ({
                        id: student.id,
                        email: student.email,
                        full_name: student.full_name,
                        student_code: student.student_code,
                        phone: student.phone,
                    }))
                );
            } finally {
                if (!cancelled) {
                    setStudentsLoading(false);
                }
            }
        };

        loadStudents();

        return () => {
            cancelled = true;
        };
    }, [group, id]);

    if (loading || !group) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    const tasks = canManageTasks ? TaskStore.list$.items : [];

    const studentColumns = isAdmin
        ? [
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
                render: (email: string) => email || "—",
            },
            {
                title: "ФИО",
                dataIndex: "full_name",
                key: "full_name",
                render: (fullName: string) => fullName || "—",
            },
            {
                title: "Код студента",
                dataIndex: "student_code",
                key: "student_code",
                render: (code: string) => code || "—",
            },
            {
                title: "Телефон",
                dataIndex: "phone",
                key: "phone",
                render: (phone: string) => phone || "—",
            },
            {
                title: "Действия",
                key: "actions",
                width: 120,
                render: (_: unknown, record: IGroupStudent) => (
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/users/${record.id}`)}
                    />
                ),
            },
        ]
        : [
            {
                title: "Код студента",
                dataIndex: "student_code",
                key: "student_code",
                render: (code: string) => code || "—",
            },
            {
                title: "Действия",
                key: "actions",
                width: 120,
                render: (_: unknown, record: IGroupStudent) => (
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/users/${record.id}`)}
                    />
                ),
            },
        ];

    const rowSelection = {
        selectedRowKeys: selectedStudentIds,
        onChange: (keys: React.Key[]) => {
            setSelectedStudentIds(keys as number[]);
        },
    };

    const hasSelection = canManageTasks && selectedStudentIds.length > 0;

    const handlePublishFromGroup = () => {
        if (!selectedTaskId) {
            message.warning("Выберите задание");
            return;
        }
        setPublishOpen(true);
    };

    const handleAssignDescriber = () => {
        if (!selectedTaskId) {
            message.warning("Выберите задание");
            return;
        }
        setAssignDescriberOpen(true);
    };

    return (
        <div className={cls.page}>
            <button className={cls.backBtn} onClick={() => navigate(routes.groups)}>
                <ArrowLeftOutlined /> Назад к списку
            </button>

            <div className={cls.header}>
                <h1>{group.name}</h1>
                <Space>
                    {canManageTasks && (
                        <Button type="primary" onClick={() => setCreateTaskOpen(true)}>
                            Создать задание
                        </Button>
                    )}
                </Space>
            </div>

            <Descriptions bordered column={2}>
                <Descriptions.Item label="Название">{group.name}</Descriptions.Item>
                <Descriptions.Item label="Курс">
                    <Tag color="blue">{group.year} курс</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Преподаватель">
                    {group.teacher?.full_name || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Дата создания">
                    {new Date(group.created_at).toLocaleDateString("ru-RU")}
                </Descriptions.Item>
                <Descriptions.Item label="Кол-во студентов">
                    {students.length}
                </Descriptions.Item>
            </Descriptions>

            {hasSelection && (
                <Space className={cls.actions} wrap>
                    <span>Выбрано студентов: {selectedStudentIds.length}</span>
                    <Select
                        placeholder="Выберите задание"
                        value={selectedTaskId}
                        onChange={setSelectedTaskId}
                        style={{minWidth: 250}}
                        allowClear
                        options={tasks.map((t: ITask) => ({
                            value: t.id,
                            label: `${t.title} (${taskStatusLabels[t.status]})`,
                        }))}
                    />
                    <Button type="primary" onClick={handlePublishFromGroup} disabled={!selectedTaskId}>
                        Дать задачу
                    </Button>
                    <Button onClick={handleAssignDescriber} disabled={!selectedTaskId || selectedStudentIds.length !== 1}>
                        Описание задачи
                    </Button>
                </Space>
            )}

            <Table<IGroupStudent>
                bordered
                dataSource={students}
                columns={studentColumns}
                rowKey="id"
                rowSelection={canManageTasks ? rowSelection : undefined}
                loading={studentsLoading}
                pagination={false}
            />

            {canManageTasks && (
                <>
                    <CreateTaskModal
                        open={createTaskOpen}
                        onClose={() => setCreateTaskOpen(false)}
                        onSuccess={() => {
                            setCreateTaskOpen(false);
                            TaskStore.fetchTasks();
                        }}
                    />

                    <PublishTaskModal
                        open={publishOpen}
                        taskId={selectedTaskId ?? 0}
                        onClose={() => setPublishOpen(false)}
                        onSuccess={() => {
                            setPublishOpen(false);
                            setSelectedStudentIds([]);
                            setSelectedTaskId(null);
                        }}
                        defaultStudentIds={selectedStudentIds}
                    />

                    <AssignDescriberModal
                        open={assignDescriberOpen}
                        taskId={selectedTaskId ?? 0}
                        onClose={() => setAssignDescriberOpen(false)}
                        onSuccess={() => {
                            setAssignDescriberOpen(false);
                            setSelectedStudentIds([]);
                            setSelectedTaskId(null);
                        }}
                        defaultDescriberId={selectedStudentIds[0]}
                    />
                </>
            )}
        </div>
    );
});

export default GroupDetailPage;
