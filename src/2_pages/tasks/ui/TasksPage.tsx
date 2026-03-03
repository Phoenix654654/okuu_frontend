import {useEffect, useState} from "react";
import {Table, Button, Space, Tabs} from "antd";
import {PlusOutlined, EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import {UserStore} from "@/5_entities/user";
import type {ITask, TaskListVisibility} from "@/5_entities/task";
import {CreateTaskModal} from "@/4_features/tasks";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {useTranslation} from "react-i18next";
import cls from "./TasksPage.module.scss";

const TasksPage = observer(() => {
    const {t} = useTranslation("tasks");
    const navigate = useNavigate();
    const [createOpen, setCreateOpen] = useState(false);
    const [visibility, setVisibility] = useState<TaskListVisibility>("shared");
    const {items, total, loading, page, pageSize} = TaskStore.list$;
    const isAdmin = UserStore.currentUser$.value?.role === "Admin";

    useEffect(() => {
        TaskStore.list$.setPageSize(10);
        TaskStore.list$.setFilters({visibility: "shared", group_id: undefined});
        TaskStore.fetchTasks();
    }, []);

    const handlePageChange = (newPage: number, newPageSize: number) => {
        if (newPageSize !== TaskStore.list$.pageSize) {
            TaskStore.list$.setPageSize(newPageSize);
        }
        TaskStore.list$.setPage(newPage);
        TaskStore.fetchTasks();
    };

    const handleVisibilityChange = (key: string) => {
        const nextVisibility = key as TaskListVisibility;
        setVisibility(nextVisibility);
        TaskStore.list$.setFilter("visibility", nextVisibility);
        TaskStore.fetchTasks();
    };

    const columns = [
        {
            title: t("table.title"),
            dataIndex: "title",
            key: "title",
        },
        {
            title: t("table.createdAt"),
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => new Date(date).toLocaleDateString("ru-RU"),
        },
        {
            title: t("table.actions"),
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
                <h1>{t("title")}</h1>
                <Space>
                    {!isAdmin && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setCreateOpen(true)}
                        >
                            {t("create")}
                        </Button>
                    )}
                </Space>
            </div>
            <Tabs
                activeKey={visibility}
                onChange={handleVisibilityChange}
                items={[
                    {key: "shared", label: t("tabs.shared")},
                    {key: "mine", label: t("tabs.mine")},
                ]}
            />
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
