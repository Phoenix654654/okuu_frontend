import {useEffect, useState} from "react";
import {Table, Button, Tag, Space} from "antd";
import {PlusOutlined, EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import {UserStore} from "@/5_entities/user";
import type {ITask, TaskStatus} from "@/5_entities/task";
import {CreateTaskModal} from "@/4_features/tasks";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {taskStatusLabels, taskStatusColors} from "@/6_shared";
import cls from "./TasksPage.module.scss";

const TasksPage = observer(() => {
    const navigate = useNavigate();
    const [createOpen, setCreateOpen] = useState(false);
    const {items, total, loading, page, pageSize} = TaskStore.list$;
    const isAdmin = UserStore.currentUser$.value?.role === "Admin";

    useEffect(() => {
        TaskStore.fetchTasks();
    }, []);

    const handlePageChange = (newPage: number, newPageSize: number) => {
        TaskStore.list$.setPage(newPage);
        TaskStore.list$.setPageSize(newPageSize);
        TaskStore.fetchTasks();
    };

    const columns = [
        {
            title: "Название",
            dataIndex: "title",
            key: "title",
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
            title: "Создано",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => new Date(date).toLocaleDateString("ru-RU"),
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
                    {!isAdmin && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setCreateOpen(true)}
                        >
                            Создать задание
                        </Button>
                    )}
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
            {!isAdmin && (
                <CreateTaskModal
                    open={createOpen}
                    onClose={() => setCreateOpen(false)}
                    onSuccess={() => TaskStore.fetchTasks()}
                />
            )}
        </div>
    );
});

export default TasksPage;
