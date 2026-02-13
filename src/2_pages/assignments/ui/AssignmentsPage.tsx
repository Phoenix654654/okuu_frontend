import {useEffect} from "react";
import {Table, Tag, Button} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import type {ITaskAssignment, AssignmentStatus} from "@/5_entities/task";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {assignmentStatusLabels, assignmentStatusColors} from "@/6_shared";
import cls from "./AssignmentsPage.module.scss";

const AssignmentsPage = observer(() => {
    const navigate = useNavigate();
    const {items, total, loading, page, pageSize} = TaskStore.assignments$;

    useEffect(() => {
        TaskStore.fetchAssignments();
    }, []);

    const handlePageChange = (newPage: number, newPageSize: number) => {
        TaskStore.assignments$.setPage(newPage);
        TaskStore.assignments$.setPageSize(newPageSize);
        TaskStore.fetchAssignments();
    };

    const columns = [
        {
            title: "Задание",
            key: "task",
            render: (_: unknown, record: ITaskAssignment) => record.task?.title || `#${record.id}`,
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (status: AssignmentStatus) => (
                <Tag color={assignmentStatusColors[status]}>{assignmentStatusLabels[status]}</Tag>
            ),
        },
        {
            title: "Дата назначения",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => new Date(date).toLocaleDateString("ru-RU"),
        },
        {
            title: "",
            key: "actions",
            width: 60,
            render: (_: unknown, record: ITaskAssignment) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/my-assignments/${record.id}`)}
                />
            ),
        },
    ];

    return (
        <div className={cls.page}>
            <h1>Мои задания</h1>
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

export default AssignmentsPage;
