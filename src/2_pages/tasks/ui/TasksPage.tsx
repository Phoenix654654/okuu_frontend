import {useEffect, useState} from "react";
import {Table, Button, Select, Tag, Space} from "antd";
import {PlusOutlined, EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import {GroupStore} from "@/5_entities/group";
import type {ITask, TaskStatus} from "@/5_entities/task";
import {CreateTaskModal} from "@/4_features/tasks";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {taskStatusLabels, taskStatusColors} from "@/6_shared";
import cls from "./TasksPage.module.scss";

const TasksPage = observer(() => {
    const navigate = useNavigate();
    const [createOpen, setCreateOpen] = useState(false);
    const {items, total, loading, page, pageSize} = TaskStore.list$;
    const groups = GroupStore.list$.items;

    useEffect(() => {
        GroupStore.list$.setPageSize(50);
        GroupStore.fetchGroups();
        TaskStore.fetchTasks();
    }, []);

    const handleGroupFilter = (groupId: number | undefined) => {
        if (groupId) {
            TaskStore.list$.setFilter("group_id", groupId);
        } else {
            TaskStore.list$.resetFilters();
        }
        TaskStore.fetchTasks();
    };

    const handlePageChange = (newPage: number, newPageSize: number) => {
        TaskStore.list$.setPage(newPage);
        TaskStore.list$.setPageSize(newPageSize);
        TaskStore.fetchTasks();
    };

    const columns = [
        {
            title: "Заголовок",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Группа",
            key: "group",
            render: (_: unknown, record: ITask) => record.group?.name || "—",
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (status: TaskStatus) => (
                <Tag color={taskStatusColors[status]}>{taskStatusLabels[status]}</Tag>
            ),
        },
        {
            title: "Дедлайн",
            dataIndex: "deadline",
            key: "deadline",
            render: (deadline: string) =>
                deadline ? new Date(deadline).toLocaleDateString("ru-RU") : "—",
        },
        {
            title: "Действия",
            key: "actions",
            width: 80,
            render: (_: unknown, record: ITask) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/tasks/${record.id}`)}
                />
            ),
        },
    ];

    return (
        <div className={cls.page}>
            <div className={cls.header}>
                <h1>Задания</h1>
                <Space>
                    <Select
                        allowClear
                        placeholder="Фильтр по группе"
                        style={{width: 200}}
                        onChange={handleGroupFilter}
                        options={groups.map(g => ({value: g.id, label: g.name}))}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setCreateOpen(true)}
                    >
                        Создать задание
                    </Button>
                </Space>
            </div>
            <Table
                dataSource={items}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false}
            />
            <AppPagination
                page={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
            />
            <CreateTaskModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={() => TaskStore.fetchTasks()}
            />
        </div>
    );
});

export default TasksPage;
