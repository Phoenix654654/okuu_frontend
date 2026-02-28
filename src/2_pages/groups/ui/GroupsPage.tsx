import {useEffect, useState} from "react";
import {Table, Button, Popconfirm, Space, Tag, Tabs, Form, InputNumber, Spin, message, Select} from "antd";
import {EditOutlined, DeleteOutlined, EyeOutlined, ClockCircleOutlined, PlayCircleOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {GroupStore} from "@/5_entities/group";
import {UserStore} from "@/5_entities/user";
import type {IGroup} from "@/5_entities/group";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {AppInput} from "@/6_shared/ui/input/AppInput";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import cls from "./GroupsPage.module.scss";

const GroupList = observer(() => {
    const navigate = useNavigate();
    const {items, total, loading, page, pageSize, filters} = GroupStore.list$;
    const isAdmin = UserStore.currentUser$.value?.role === "Admin";
    const [activeTab, setActiveTab] = useState<string>("active");

    useEffect(() => {
        GroupStore.fetchGroups({ is_finished: activeTab === "active" ? false : true });
    }, [activeTab]);

    const handlePageChange = (newPage: number, newPageSize: number) => {
        GroupStore.list$.setPage(newPage);
        GroupStore.list$.setPageSize(newPageSize);
        GroupStore.fetchGroups({ is_finished: activeTab === "active" ? false : true });
    };

    const handleYearFilter = (year: number | undefined) => {
        GroupStore.list$.setFilter("year", year ?? undefined);
        GroupStore.fetchGroups({ is_finished: activeTab === "active" ? false : true });
    };

    const handleDelete = async (id: number) => {
        const success = await GroupStore.deleteGroup(id);
        if (success) {
            GroupStore.fetchGroups({ is_finished: activeTab === "active" ? false : true });
        }
    };

    const handleEdit = (id: number) => {
        GroupStore.fetchGroup(id);
        GroupStore.editingGroupId = id;
    };

    const handleMarkFinished = async (id: number, isFinished: boolean) => {
        const success = await GroupStore.markFinished(id, { is_finished: isFinished });
        if (success) {
            message.success(isFinished ? "Группа отмечена как завершившая обучение" : "Группа отмечена как активная");
            GroupStore.fetchGroups({ is_finished: activeTab === "active" ? false : true });
        } else {
            message.error("Произошла ошибка");
        }
    };

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        GroupStore.list$.setPage(1);
        GroupStore.list$.setFilters({ year: undefined, is_finished: key === "active" ? false : true });
        GroupStore.fetchGroups({ is_finished: key === "active" ? false : true });
    };

    const columns = [
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
            render: (name: string, record: IGroup) => (
                <a onClick={() => navigate(`/groups/${record.id}`)}>{name}</a>
            ),
        },
        {
            title: "Курс",
            dataIndex: "year",
            key: "year",
            render: (year: number) => <Tag color="blue">{year} курс</Tag>,
        },
        {
            title: "Преподаватель",
            key: "teacher",
            render: (_: unknown, record: IGroup) => record.teacher?.full_name || "—",
        },
        {
            title: "Статус",
            key: "is_finished",
            render: (_: unknown, record: IGroup) => (
                <Tag color={record.is_finished ? "orange" : "green"}>
                    {record.is_finished ? "Завершена" : "Активна"}
                </Tag>
            ),
        },
    ];

    columns.push({
        title: "Действия",
        key: "actions",
        width: 240,
        render: (_: unknown, record: IGroup) => (
            <Space>
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/groups/${record.id}`)}
                />
                {isAdmin && (
                    <>
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.id)}
                        />
                        <Popconfirm
                            title={record.is_finished ? "Отметить группу как активную?" : "Отметить группу как завершившую обучение?"}
                            onConfirm={() => handleMarkFinished(record.id, !record.is_finished)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button
                                type="text"
                                danger={!record.is_finished}
                                icon={record.is_finished ? <PlayCircleOutlined /> : <ClockCircleOutlined />}
                            >
                                {record.is_finished ? "Активировать" : "Завершить"}
                            </Button>
                        </Popconfirm>
                        <Popconfirm
                            title="Удалить группу?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </>
                )}
            </Space>
        ),
    });

    return (
        <>
            <div className={cls.filters}>
                <Select
                    allowClear
                    placeholder="Фильтр по курсу"
                    value={filters.year}
                    onChange={handleYearFilter}
                    style={{width: 220}}
                    options={Array.from({length: 10}, (_, index) => {
                        const year = index + 1;
                        return {value: year, label: `${year} курс`};
                    })}
                />
            </div>
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={[
                    { key: "active", label: "Активные" },
                    { key: "finished", label: "Завершившие" },
                ]}
            />
            <Table
                bordered
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
                style={{marginTop: 16}}
            />
        </>
    );
});

const GroupForm = observer(() => {
    const editingId = GroupStore.editingGroupId;
    const isEdit = Boolean(editingId);
    const group = GroupStore.current$.value;
    const loadingGroup = GroupStore.current$.loading;

    const [name, setName] = useState("");
    const [year, setYear] = useState<number>(1);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isEdit && group) {
            setName(group.name);
            setYear(group.year);
        }
    }, [group, isEdit]);

    const resetForm = () => {
        setName("");
        setYear(1);
        GroupStore.editingGroupId = null;
        GroupStore.current$.clear();
    };

    const handleSubmit = async () => {
        const teacherId = UserStore.currentUser$.value?.id;
        if (!teacherId) return;

        setSubmitting(true);

        let success: boolean;
        if (isEdit && editingId) {
            success = await GroupStore.updateGroup(editingId, {name, year});
        } else {
            success = await GroupStore.createGroup({teacher: teacherId, name, year});
        }

        setSubmitting(false);

        if (success) {
            message.success(isEdit ? "Группа обновлена" : "Группа создана");
            resetForm();
            GroupStore.fetchGroups();
        } else {
            message.error("Произошла ошибка");
        }
    };

    if (isEdit && loadingGroup) {
        return <Spin size="large" />;
    }

    return (
        <div className={cls.formWrapper}>
            <h2>{isEdit ? "Редактирование группы" : "Создание группы"}</h2>
            <Form layout="vertical" className={cls.form} onFinish={handleSubmit}>
                <Form.Item label="Название группы">
                    <AppInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Например: ИТ-1-23"
                    />
                </Form.Item>
                <Form.Item label="Курс">
                    <InputNumber
                        min={1}
                        max={10}
                        value={year}
                        onChange={(val) => setYear(val || 1)}
                        style={{width: "100%"}}
                    />
                </Form.Item>
                <div className={cls.actions}>
                    {isEdit && (
                        <AppButton onClick={resetForm}>
                            Отмена
                        </AppButton>
                    )}
                    <AppButton
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        disabled={!name.trim()}
                    >
                        {isEdit ? "Сохранить" : "Создать"}
                    </AppButton>
                </div>
            </Form>
        </div>
    );
});

const GroupsPage = observer(() => {
    const isAdmin = UserStore.currentUser$.value?.role === "Admin";

    const tabItems = [
        {
            key: "list",
            label: "Список групп",
            children: <GroupList />,
        },
    ];

    if (!isAdmin) {
        tabItems.push({
            key: "create",
            label: GroupStore.editingGroupId ? "Редактирование" : "Создание",
            children: <GroupForm />,
        });
    }

    return (
        <div className={cls.page}>
            <Tabs
                items={tabItems}
                activeKey={GroupStore.editingGroupId ? "create" : undefined}
            />
        </div>
    );
});

export default GroupsPage;
