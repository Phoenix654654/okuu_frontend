import {useEffect} from "react";
import {Table, Tag, Button} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {TaskStore} from "@/5_entities/task";
import type {ISubmission} from "@/5_entities/task";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import cls from "./SubmissionsPage.module.scss";

const SubmissionsPage = observer(() => {
    const navigate = useNavigate();
    const {items, total, loading, page, pageSize} = TaskStore.submissions$;

    useEffect(() => {
        TaskStore.submissions$.setFilter("task_id", undefined);
        TaskStore.fetchSubmissions();
    }, []);

    const handlePageChange = (newPage: number, newPageSize: number) => {
        TaskStore.submissions$.setPage(newPage);
        TaskStore.submissions$.setPageSize(newPageSize);
        TaskStore.fetchSubmissions();
    };

    const columns = [
        {
            title: "Задание",
            dataIndex: "task_title",
            key: "task_title",
        },
        {
            title: "Студент",
            dataIndex: "student",
            key: "student",
        },
        {
            title: "Дата отправки",
            dataIndex: "submitted_at",
            key: "submitted_at",
            render: (date: string) => date ? new Date(date).toLocaleString("ru-RU") : "—",
        },
        {
            title: "Оценка",
            dataIndex: "score",
            key: "score",
            render: (score: number | null) =>
                score !== null ? <Tag color="green">{score}/5</Tag> : <Tag>Не оценено</Tag>,
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
            <h1>Решения студентов</h1>
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

export default SubmissionsPage;
