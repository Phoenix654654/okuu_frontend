import {useEffect, useState} from "react";
import {Table, Button, Spin, Descriptions, Tag, Space} from "antd";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {GroupStore} from "@/5_entities/group";
import {TaskStore} from "@/5_entities/task";
import type {IGroupStudent} from "@/5_entities/group";
import {CreateTaskModal, AssignDescriberModal} from "@/4_features/tasks";
import {routes} from "@/6_shared";
import cls from "./GroupDetailPage.module.scss";

const GroupDetailPage = observer(() => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const group = GroupStore.current$.value;
    const loading = GroupStore.current$.loading;

    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [assignDescriberOpen, setAssignDescriberOpen] = useState(false);

    useEffect(() => {
        if (id) {
            GroupStore.fetchGroup(Number(id));
            GroupStore.fetchGroups();
            TaskStore.list$.setFilter("group_id", Number(id));
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

    const studentColumns = [
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

    const tasks = TaskStore.list$.items;

    return (
        <div className={cls.page}>
            <div className={cls.header}>
                <h1>{group.name}</h1>
                <Button onClick={() => navigate(routes.groups)}>Назад</Button>
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
                <Space className={cls.actions}>
                    <span>Выбрано: {selectedStudentIds.length}</span>
                    <Button type="primary" onClick={() => setCreateTaskOpen(true)}>
                        Дать задачу
                    </Button>
                    <Button onClick={() => setAssignDescriberOpen(true)}>
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
                    setSelectedStudentIds([]);
                }}
                defaultGroupId={group.id}
            />

            <AssignDescriberModal
                open={assignDescriberOpen}
                taskId={tasks[0]?.id ?? 0}
                onClose={() => setAssignDescriberOpen(false)}
                onSuccess={() => {
                    setAssignDescriberOpen(false);
                    setSelectedStudentIds([]);
                }}
                defaultDescriberId={selectedStudentIds[0]}
            />
        </div>
    );
});

export default GroupDetailPage;
