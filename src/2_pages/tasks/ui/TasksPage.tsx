import {useEffect, useState} from "react";
import {Table, Button, Space, Tabs, List, Card} from "antd";
import {PlusOutlined, EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import {UserStore} from "@/5_entities/user";
import type {ITask, TaskListVisibility} from "@/5_entities/task";
import {CreateTaskModal} from "@/4_features/tasks";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {useMediaQuery} from "@/6_shared/lib/hooks/useMediaQuery/useMediaQuery";
import {useTranslation} from "react-i18next";
import cls from "./TasksPage.module.scss";

const TasksPage = observer(() => {
    const {t} = useTranslation("tasks");
    const navigate = useNavigate();
    const [createOpen, setCreateOpen] = useState(false);
    const [visibility, setVisibility] = useState<TaskListVisibility>("shared");
    const {items, total, loading, page, pageSize} = TaskStore.list$;
    const isAdmin = UserStore.currentUser$.value?.role === "Admin";
    const isPhone = useMediaQuery("(max-width: 700px)");

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
            {isPhone ? (
                <List
                    className={cls.cardList}
                    loading={loading}
                    dataSource={items}
                    renderItem={(record: ITask) => (
                        <List.Item className={cls.cardListItem}>
                            <Card
                                size="small"
                                className={cls.taskCard}
                                title={
                                    <button
                                        type="button"
                                        className={cls.cardHeaderBtn}
                                        onClick={() => navigate(`/tasks/${record.id}`)}
                                    >
                                        <span className={cls.cardHeaderName} title={record.title}>
                                            {record.title}
                                        </span>
                                    </button>
                                }
                            >
                                <div className={cls.cardMeta}>
                                    <div className={cls.cardLine}>
                                        <span className={cls.cardLabel}>{t("table.createdBy")}:</span>
                                        <span className={cls.cardValue}>
                                            {record.teacher?.full_name || record.teacher?.email || "-"}
                                        </span>
                                    </div>
                                    <div className={cls.cardLine}>
                                        <span className={cls.cardLabel}>{t("table.createdAt")}:</span>
                                        <span className={cls.cardValue}>
                                            {new Date(record.created_at).toLocaleDateString("ru-RU")}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <Table
                    dataSource={items}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    scroll={{x: "max-content"}}
                    pagination={false}
                />
            )}
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
