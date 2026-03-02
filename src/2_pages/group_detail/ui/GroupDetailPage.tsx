import {useEffect, useState, type Key, type UIEvent} from "react";
import {Table, Button, Spin, Descriptions, Tag, Space, TreeSelect, message} from "antd";
import {ArrowLeftOutlined, EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {GroupStore} from "@/5_entities/group";
import {taskService} from "@/5_entities/task";
import {UserStore, userService} from "@/5_entities/user";
import type {IGroupStudent} from "@/5_entities/group";
import type {ITask, ITaskDescription} from "@/5_entities/task";
import {CreateTaskModal, AssignDescriberModal, PublishTaskModal} from "@/4_features/tasks";
import {routes} from "@/6_shared";
import cls from "./GroupDetailPage.module.scss";

const TASKS_PAGE_SIZE = 20;

interface DescriptionOption {
    value: number;
    label: string;
}

interface TaskTreeItem {
    id: string;
    value: string;
    title: string | React.ReactNode;
    label?: string;
    isTask: boolean;
    taskId?: number;
    descriptionId?: number;
    hasDescription?: boolean;
    selectable?: boolean;
    isLeaf?: boolean;
    children?: TaskTreeItem[];
}

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
    const [selectedDescriptionId, setSelectedDescriptionId] = useState<number | null>(null);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [assignDescriberOpen, setAssignDescriberOpen] = useState(false);
    const [publishOpen, setPublishOpen] = useState(false);
    const [students, setStudents] = useState<IGroupStudent[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [tasksTotal, setTasksTotal] = useState(0);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [tasksLoadingMore, setTasksLoadingMore] = useState(false);
    const [taskTree, setTaskTree] = useState<TaskTreeItem[]>([]);
    const [descriptionsByTask, setDescriptionsByTask] = useState<Record<number, ITaskDescription[]>>({});
    const [descriptionsLoading, setDescriptionsLoading] = useState<Record<number, boolean>>({});
    const [expandedTaskKeys, setExpandedTaskKeys] = useState<string[]>([]);

    const loadTasks = async (append = false) => {
        if (!canManageTasks) return;
        if (append && (tasksLoading || tasksLoadingMore || tasks.length >= tasksTotal)) return;

        const offset = append ? tasks.length : 0;

        if (append) {
            setTasksLoadingMore(true);
        } else {
            setTasksLoading(true);
        }

        try {
            const response = await taskService.getList({
                limit: TASKS_PAGE_SIZE,
                offset,
            });

            if (append) {
                setTasks((prev) => [...prev, ...response.results]);
            } else {
                setTasks(response.results);
            }
            setTasksTotal(response.count);
        } finally {
            if (append) {
                setTasksLoadingMore(false);
            } else {
                setTasksLoading(false);
            }
        }
    };

    const loadDescriptions = async (taskId: number) => {
        if (descriptionsByTask[taskId]) {
            console.log('Описания уже загружены для задачи', taskId);
            return;
        }

        console.log('Загрузка описаний для задачи', taskId);
        setDescriptionsLoading((prev) => ({...prev, [taskId]: true}));
        try {
            const response = await taskService.getDescriptionsByTask(taskId);
            console.log('Получены описания:', response);
            setDescriptionsByTask((prev) => ({...prev, [taskId]: response}));
        } catch (error) {
            console.error('Error loading descriptions:', error);
        } finally {
            setDescriptionsLoading((prev) => ({...prev, [taskId]: false}));
        }
    };

    const buildTaskTree = (): TaskTreeItem[] => {
        const tree = tasks.map((task) => {
            // has_description может приходить как строка "true"/"false" или boolean
            const taskHasDescriptions = task.has_description === true || task.has_description === "true";
            const descriptions = descriptionsByTask[task.id] || [];
            const isExpanded = expandedTaskKeys.includes(`task-${task.id}`);

            console.log(`Задача ${task.id}: has_description=${taskHasDescriptions}, описаний=${descriptions.length}, expanded=${isExpanded}`);

            const children: TaskTreeItem[] = descriptions.map((desc) => ({
                id: `desc-${desc.id}`,
                value: `desc-${desc.id}`,
                title: `Описание (${desc.describer?.student_code || "—"})`,
                label: `Описание (${desc.describer?.student_code || "—"})`,
                isTask: false,
                taskId: task.id,
                descriptionId: desc.id,
                isLeaf: true,
            }));

            // Если задача не имеет описания (has_description=false), не показываем children
            // и не даем раскрыть узел. Если has_description=true, показываем стрелку
            return {
                id: `task-${task.id}`,
                value: `task-${task.id}`,
                title: task.title,
                label: task.title,
                isTask: true,
                taskId: task.id,
                hasDescription: taskHasDescriptions,
                isLeaf: !taskHasDescriptions,
                // Всегда передаем children для задач с описаниями, чтобы была стрелка раскрытия
                children: taskHasDescriptions ? children : undefined,
            };
        });
        console.log('Дерево задач:', tree);
        return tree;
    };

    useEffect(() => {
        if (id) {
            GroupStore.fetchGroup(Number(id));
        }

        return () => {
            GroupStore.current$.clear();
            setStudents([]);
            setStudentsLoading(false);
            setTasks([]);
            setTasksTotal(0);
            setTasksLoading(false);
            setTasksLoadingMore(false);
            setTaskTree([]);
            setDescriptionsByTask({});
            setDescriptionsLoading({});
            setExpandedTaskKeys([]);
            setSelectedTaskId(null);
            setSelectedDescriptionId(null);
        };
    }, [id]);

    useEffect(() => {
        if (canManageTasks) {
            loadTasks(false);
        }
    }, [canManageTasks]);

    useEffect(() => {
        setTaskTree(buildTaskTree());
    }, [tasks, descriptionsByTask]);

    // Автоматически раскрывать задачу, когда описания загружены
    useEffect(() => {
        if (selectedTaskId && descriptionsByTask[selectedTaskId]) {
            const taskKey = `task-${selectedTaskId}`;
            if (!expandedTaskKeys.includes(taskKey)) {
                setExpandedTaskKeys((prev) => [...prev, taskKey]);
            }
        }
    }, [descriptionsByTask, selectedTaskId]);

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

    const hasMoreTasks = tasks.length < tasksTotal;

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
        onChange: (keys: Key[]) => {
            setSelectedStudentIds(keys as number[]);
        },
    };

    const hasSelection = canManageTasks && selectedStudentIds.length > 0;

    const isTaskSelected = selectedTaskId !== null && selectedDescriptionId === null;
    const isDescriptionSelected = selectedDescriptionId !== null;

    // "Дать задачу" — только когда выбрано описание
    const disableGiveTask = !isDescriptionSelected;
    // "Назначить описателя" — только когда выбрана задача (не описание)
    const disableAssignDescription = !isTaskSelected;

    // Формируем опции описаний для модального окна публикации
    const descriptionOptions: DescriptionOption[] = selectedTaskId && descriptionsByTask[selectedTaskId]
        ? descriptionsByTask[selectedTaskId].map((desc) => ({
            value: desc.id,
            label: `Описание #${desc.id} (${desc.describer?.full_name || "—"})`,
        }))
        : [];

    const handleTreeSelect = (value: string, info: { selected?: boolean; node?: TaskTreeItem }) => {
        console.log('handleTreeSelect:', value, info);
        if (!info.node || !info.selected) {
            setSelectedTaskId(null);
            setSelectedDescriptionId(null);
            return;
        }

        if (info.node.isTask) {
            setSelectedDescriptionId(null);
            // Если задача не имеет описания (has_description=false), только выбираем её
            // has_description может приходить как строка "true"/"false" или boolean
            const hasDescription = info.node.hasDescription === true || info.node.hasDescription === "true";
            if (!hasDescription) {
                setSelectedTaskId(info.node.taskId ?? null);
            } else {
                // Задача имеет описания - выбираем и загружаем описания
                setSelectedTaskId(info.node.taskId ?? null);
                loadDescriptions(info.node.taskId ?? 0);
            }
        } else {
            // Выбрано описание
            setSelectedTaskId(info.node.taskId ?? null);
            setSelectedDescriptionId(info.node.descriptionId ?? null);
        }
    };

    const handleTreeExpand = (expandedKeys: string[]) => {
        console.log('handleTreeExpand:', expandedKeys);
        setExpandedTaskKeys(expandedKeys);
        // При раскрытии узла задачи загружаем описания
        expandedKeys.forEach((key) => {
            if (key.startsWith('task-')) {
                const taskId = Number(key.replace('task-', ''));
                if (taskId && !descriptionsByTask[taskId]) {
                    loadDescriptions(taskId);
                }
            }
        });
    };

    const handlePublishFromGroup = () => {
        if (!selectedDescriptionId) {
            message.warning("Выберите описание задачи");
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
                    <Tag color={group.is_finished ? "orange" : "green"}>
                        {group.is_finished ? "Завершила обучение" : "Активна"}
                    </Tag>
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
                <Descriptions.Item label="Статус">
                    <Tag color={group.is_finished ? "orange" : "green"}>
                        {group.is_finished ? "Завершила обучение" : "Активна"}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>

            {hasSelection && (
                <Space className={cls.actions} wrap>
                    <span>Выбрано студентов: {selectedStudentIds.length}</span>
                    <TreeSelect
                        placeholder="Выберите задание или описание"
                        value={selectedDescriptionId ? `desc-${selectedDescriptionId}` : (selectedTaskId ? `task-${selectedTaskId}` : undefined)}
                        onChange={handleTreeSelect}
                        onTreeExpand={handleTreeExpand}
                        expandedKeys={expandedTaskKeys}
                        treeData={taskTree}
                        style={{minWidth: 300}}
                        allowClear
                        showSearch
                        treeDefaultExpandAll={false}
                        loading={tasksLoading || tasksLoadingMore}
                        notFoundContent={tasksLoading ? <Spin size="small" /> : undefined}
                        treeNodeFilterProp="label"
                        treeIcon
                    />
                    <Button type="primary" onClick={handlePublishFromGroup} disabled={disableGiveTask}>
                        Дать задачу
                    </Button>
                    <Button onClick={handleAssignDescriber} disabled={disableAssignDescription}>
                        Назначить описателя
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
                            loadTasks(false);
                        }}
                    />

                    <PublishTaskModal
                        open={publishOpen}
                        taskId={selectedTaskId ?? 0}
                        descriptionId={selectedDescriptionId ?? undefined}
                        onClose={() => setPublishOpen(false)}
                        onSuccess={() => {
                            setPublishOpen(false);
                            setSelectedStudentIds([]);
                            setSelectedTaskId(null);
                            setSelectedDescriptionId(null);
                        }}
                        defaultStudentIds={selectedStudentIds}
                        descriptionOptions={descriptionOptions}
                    />

                    <AssignDescriberModal
                        open={assignDescriberOpen}
                        taskId={selectedTaskId ?? undefined}
                        onClose={() => setAssignDescriberOpen(false)}
                        onSuccess={() => {
                            setAssignDescriberOpen(false);
                            setSelectedStudentIds([]);
                            setSelectedTaskId(null);
                            setSelectedDescriptionId(null);
                        }}
                        defaultDescriberId={selectedStudentIds[0]}
                    />
                </>
            )}
        </div>
    );
});

export default GroupDetailPage;
