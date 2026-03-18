import {useEffect} from "react";
import {Table, Tag, Button} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import type {ISubmission} from "@/5_entities/task";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {useTranslation} from "react-i18next";
import cls from "./SubmissionsPage.module.scss";

const SubmissionsPage = observer(() => {
    const {t} = useTranslation("submissions");
    const navigate = useNavigate();
    const {items, total, loading, page, pageSize} = TaskStore.submissions$;

    useEffect(() => {
        TaskStore.submissions$.setFilters({
            task_id: undefined,
            student_id: undefined,
        });
        TaskStore.fetchSubmissions();
    }, []);

    const handlePageChange = (newPage: number, newPageSize: number) => {
        if (newPageSize !== TaskStore.submissions$.pageSize) {
            TaskStore.submissions$.setPageSize(newPageSize);
        }
        TaskStore.submissions$.setPage(newPage);
        TaskStore.fetchSubmissions();
    };

    const columns = [
        {
            title: t("table.task"),
            dataIndex: "task_title",
            key: "task_title",
        },
        {
            title: t("table.student"),
            dataIndex: "student",
            key: "student",
        },
        {
            title: t("table.submittedAt"),
            dataIndex: "submitted_at",
            key: "submitted_at",
            render: (date: string) => date ? new Date(date).toLocaleString("ru-RU") : "—",
        },
        {
            title: t("table.score"),
            dataIndex: "score",
            key: "score",
            render: (score: number | null) =>
                score !== null ? <Tag color="green">{score}/5</Tag> : <Tag>{t("notGraded")}</Tag>,
        },
        {
            title: "",
            key: "actions",
            width: 60,
            render: (_: unknown, record: ISubmission) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/submissions/${record.id}`)}
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
                scroll={{x: "max-content"}}
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

export default SubmissionsPage;
