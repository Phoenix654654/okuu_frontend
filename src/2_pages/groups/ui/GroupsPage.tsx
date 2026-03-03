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
import {useTranslation} from "react-i18next";
import cls from "./GroupsPage.module.scss";

const GroupList = observer(() => {
    const {t} = useTranslation("groups");
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
            message.success(isFinished ? t("messages.markFinished") : t("messages.markActive"));
            GroupStore.fetchGroups({ is_finished: activeTab === "active" ? false : true });
        } else {
            message.error(t("messages.error"));
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
            title: t("table.name"),
            dataIndex: "name",
            key: "name",
            render: (name: string, record: IGroup) => (
                <a onClick={() => navigate(`/groups/${record.id}`)}>{name}</a>
            ),
        },
        {
            title: t("table.year"),
            dataIndex: "year",
            key: "year",
            render: (year: number) => <Tag color="blue">{t("table.yearValue", {year})}</Tag>,
        },
        {
            title: t("table.teacher"),
            key: "teacher",
            render: (_: unknown, record: IGroup) => record.teacher?.full_name || "—",
        },
        {
            title: t("table.status"),
            key: "is_finished",
            render: (_: unknown, record: IGroup) => (
                <Tag color={record.is_finished ? "orange" : "green"}>
                    {record.is_finished ? t("status.finished") : t("status.active")}
                </Tag>
            ),
        },
    ];

    columns.push({
        title: t("table.actions"),
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
                            title={record.is_finished ? t("confirm.markActive") : t("confirm.markFinished")}
                            onConfirm={() => handleMarkFinished(record.id, !record.is_finished)}
                            okText={t("confirm.yes")}
                            cancelText={t("confirm.no")}
                        >
                            <Button
                                type="text"
                                danger={!record.is_finished}
                                icon={record.is_finished ? <PlayCircleOutlined /> : <ClockCircleOutlined />}
                            >
                                {record.is_finished ? t("buttons.activate") : t("buttons.finish")}
                            </Button>
                        </Popconfirm>
                        <Popconfirm
                            title={t("confirm.delete")}
                            onConfirm={() => handleDelete(record.id)}
                            okText={t("confirm.yes")}
                            cancelText={t("confirm.no")}
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
                    placeholder={t("filters.year")}
                    value={filters.year}
                    onChange={handleYearFilter}
                    style={{width: 220}}
                    options={Array.from({length: 10}, (_, index) => {
                        const year = index + 1;
                        return {value: year, label: t("table.yearValue", {year})};
                    })}
                />
            </div>
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={[
                    { key: "active", label: t("tabs.active") },
                    { key: "finished", label: t("tabs.finished") },
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
    const {t} = useTranslation("groups");
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
            message.success(isEdit ? t("messages.updated") : t("messages.created"));
            resetForm();
            GroupStore.fetchGroups();
        } else {
            message.error(t("messages.error"));
        }
    };

    if (isEdit && loadingGroup) {
        return <Spin size="large" />;
    }

    return (
        <div className={cls.formWrapper}>
            <h2>{isEdit ? t("form.editTitle") : t("form.createTitle")}</h2>
            <Form layout="vertical" className={cls.form} onFinish={handleSubmit}>
                <Form.Item label={t("form.groupName")}>
                    <AppInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("form.groupPlaceholder")}
                    />
                </Form.Item>
                <Form.Item label={t("form.year")}>
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
                            {t("form.cancel")}
                        </AppButton>
                    )}
                    <AppButton
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        disabled={!name.trim()}
                    >
                        {isEdit ? t("form.save") : t("form.create")}
                    </AppButton>
                </div>
            </Form>
        </div>
    );
});

const GroupsPage = observer(() => {
    const {t} = useTranslation("groups");
    const isAdmin = UserStore.currentUser$.value?.role === "Admin";

    const tabItems = [
        {
            key: "list",
            label: t("page.listTab"),
            children: <GroupList />,
        },
    ];

    if (!isAdmin) {
        tabItems.push({
            key: "create",
            label: GroupStore.editingGroupId ? t("page.editTab") : t("page.createTab"),
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
