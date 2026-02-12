import {useEffect} from "react";
import {Table, Tag, Button} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import type {ITaskDescription, DescriptionStatus} from "@/5_entities/task";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {descriptionStatusLabels, descriptionStatusColors} from "@/6_shared";
import cls from "./DescriptionsPage.module.scss";

const DescriptionsPage = observer(() => {
    const navigate = useNavigate();
    const {items, total, loading, page, pageSize} = TaskStore.descriptions$;

    useEffect(() => {
        TaskStore.fetchDescriptions();
    }, []);

    const handlePageChange = (newPage: number, newPageSize: number) => {
        TaskStore.descriptions$.setPage(newPage);
        TaskStore.descriptions$.setPageSize(newPageSize);
        TaskStore.fetchDescriptions();
    };

    const columns = [
        {
            title: "Задание",
            dataIndex: "task",
            key: "task",
            render: (taskId: number) => `Задание #${taskId}`,
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (status: DescriptionStatus) => (
                <Tag color={descriptionStatusColors[status]}>{descriptionStatusLabels[status]}</Tag>
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
            title: "Комментарий",
            dataIndex: "comment",
            key: "comment",
            ellipsis: true,
            render: (comment: string | null) => comment || "—",
        },
        {
            title: "",
            key: "actions",
            width: 60,
            render: (_: unknown, record: ITaskDescription) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/my-descriptions/${record.id}`)}
                />
            ),
        },
    ];

    return (
        <div className={cls.page}>
            <h1>Мои описания</h1>
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
        </div>
    );
});

export default DescriptionsPage;
