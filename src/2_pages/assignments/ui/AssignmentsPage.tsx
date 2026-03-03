import {useEffect} from "react";
import {Table, Tag, Button} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import type {ITaskAssignment, AssignmentStatus} from "@/5_entities/task";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {assignmentStatusColors, getAssignmentStatusLabels} from "@/6_shared";
import {useTranslation} from "react-i18next";
import cls from "./AssignmentsPage.module.scss";

const AssignmentsPage = observer(() => {
    const {t} = useTranslation("assignments");
    const navigate = useNavigate();
    const {items, total, loading, page, pageSize} = TaskStore.assignments$;
    const assignmentStatusLabels = getAssignmentStatusLabels();

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
            title: t("table.task"),
            key: "task",
            render: (_: unknown, record: ITaskAssignment) => record.task?.title || `#${record.id}`,
        },
        {
            title: t("table.status"),
            dataIndex: "status",
            key: "status",
            render: (status: AssignmentStatus) => (
                <Tag color={assignmentStatusColors[status]}>{assignmentStatusLabels[status]}</Tag>
            ),
        },
        {
            title: t("table.assignedAt"),
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
            <h1>{t("title")}</h1>
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
