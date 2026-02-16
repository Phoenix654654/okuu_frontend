import {useEffect, useState} from "react";
import {Table, Button, Spin, Descriptions, Tag, Space, Select, message} from "antd";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {GroupStore} from "@/5_entities/group";
import {TaskStore} from "@/5_entities/task";
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

    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [assignDescriberOpen, setAssignDescriberOpen] = useState(false);
    const [publishOpen, setPublishOpen] = useState(false);

    useEffect(() => {
        if (id) {
            GroupStore.fetchGroup(Number(id));
            TaskStore.list$.setPageSize(50);
            TaskStore.fetchTasks();
        }
        return () => {
            GroupStore.current$.clear();
        };
    }, [id]);

    if (loading || !group) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    const students = group.students || [];
    const tasks = TaskStore.list$.items;

    const studentColumns = [
        {
            title: "ФИО",
            dataIndex: "full_name",
            key: "full_name",
        },
        {
            title: "Код студента",
            dataIndex: "student_code",
            key: "student_code",
            render: (code: string) => code || "—",
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedStudentIds,
        onChange: (keys: React.Key[]) => {
            setSelectedStudentIds(keys as number[]);
        },
    };

    const hasSelection = selectedStudentIds.length > 0;

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
            <div className={cls.header}>
                <h1>{group.name}</h1>
                <Space>
                    <Button type="primary" onClick={() => setCreateTaskOpen(true)}>
                        Создать задание
                    </Button>
                    <Button onClick={() => navigate(routes.groups)}>Назад</Button>
                </Space>
            </div>

            <Descriptions bordered size="small" column={2}>
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
                dataSource={students}
                columns={studentColumns}
                rowKey="id"
                rowSelection={rowSelection}
                pagination={false}
                size="small"
            />

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
        </div>
    );
});

export default GroupDetailPage;
