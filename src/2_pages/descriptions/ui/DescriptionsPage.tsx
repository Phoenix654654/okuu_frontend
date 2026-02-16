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
            key: "task",
            render: (_: unknown, record: ITaskDescription) => record.task?.title || `#${record.id}`,
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (s: DescriptionStatus) => (
                <Tag color={descriptionStatusColors[s]}>{descriptionStatusLabels[s]}</Tag>
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
            title: "Создано",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) =>
                date ? new Date(date).toLocaleDateString("ru-RU") : "—",
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
