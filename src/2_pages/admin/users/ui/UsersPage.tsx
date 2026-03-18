import {useEffect, useCallback, useState} from "react";
import {Table, Tag, Space, Button, Select, Popconfirm, message, Tabs, Form} from "antd";
import {EyeOutlined, CheckOutlined, LockOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {UserAdminStore} from "@/5_entities/user";
import type {IUser, CreateUserRequest} from "@/5_entities/user";
import {groupService} from "@/5_entities/group";
import type {IGroup} from "@/5_entities/group";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {AppInput} from "@/6_shared/ui/input/AppInput";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import {useDebounce} from "@/6_shared/lib/hooks/useDebounce/useDebounce";
import {roleColors, getRoleLabels} from "@/6_shared";
import {useTranslation} from "react-i18next";
import cls from "./UsersPage.module.scss";

const GROUPS_PAGE_SIZE = 30;

const UserList = observer(() => {
    const {t} = useTranslation("users");
    const navigate = useNavigate();
    const {items, total, loading, page, pageSize, filters} = UserAdminStore.list$;
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [groupsTotal, setGroupsTotal] = useState(0);
    const [groupsOffset, setGroupsOffset] = useState(0);
    const [groupsLoading, setGroupsLoading] = useState(false);
    const roleLabels = getRoleLabels();

    useEffect(() => {
        UserAdminStore.fetchUsers();
        let cancelled = false;

        const loadInitialGroups = async () => {
            setGroupsLoading(true);
            try {
                const res = await groupService.getList({limit: GROUPS_PAGE_SIZE, offset: 0});
                if (cancelled) return;
                setGroups(res.results);
                setGroupsTotal(res.count);
                setGroupsOffset(res.results.length);
            } finally {
                if (!cancelled) {
                    setGroupsLoading(false);
                }
            }
        };

        loadInitialGroups();

        return () => {
            cancelled = true;
        };
    }, []);

    const loadGroups = useCallback(async (reset = false) => {
        if (groupsLoading) return;

        const offset = reset ? 0 : groupsOffset;
        setGroupsLoading(true);
        try {
            const res = await groupService.getList({limit: GROUPS_PAGE_SIZE, offset});
            setGroupsTotal(res.count);
            setGroups((prev) => {
                if (reset) return res.results;
                const existing = new Set(prev.map((g) => g.id));
                const next = res.results.filter((g) => !existing.has(g.id));
                return [...prev, ...next];
            });
            setGroupsOffset(offset + res.results.length);
        } finally {
            setGroupsLoading(false);
        }
    }, [groupsLoading, groupsOffset]);

    const handleGroupsPopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isBottomReached = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
        const hasMore = groups.length < groupsTotal;

        if (isBottomReached && hasMore && !groupsLoading) {
            loadGroups();
        }
    };

    const debouncedFetch = useDebounce(() => {
        UserAdminStore.fetchUsers();
    }, 500);

    const handleTextFilter = useCallback((key: "full_name__icontains" | "student_code__icontains") => (e: React.ChangeEvent<HTMLInputElement>) => {
        UserAdminStore.list$.setFilter(key, e.target.value || undefined);
        debouncedFetch();
    }, [debouncedFetch]);

    const handleSelectFilter = (key: "role" | "is_active" | "group") => (value: unknown) => {
        UserAdminStore.list$.setFilter(key, value ?? undefined);
        UserAdminStore.fetchUsers();
    };

    const handlePageChange = (newPage: number, newPageSize: number) => {
        UserAdminStore.list$.setPage(newPage);
        UserAdminStore.list$.setPageSize(newPageSize);
        UserAdminStore.fetchUsers();
    };

    const handleActivate = async (id: number) => {
        const success = await UserAdminStore.activateUser(id);
        if (success) message.success(t("messages.activated"));
    };

    const handleDeactivate = async (id: number) => {
        const success = await UserAdminStore.deactivateUser(id);
        if (success) message.success(t("messages.deactivated"));
    };

    const columns = [
        {
            title: t("table.fullName"),
            dataIndex: "full_name",
            key: "full_name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: t("table.studentCode"),
            dataIndex: "student_code",
            key: "student_code",
            render: (code: string) => code || "—",
        },
        {
            title: t("table.role"),
            dataIndex: "role",
            key: "role",
            render: (role: string) => (
                <Tag color={roleColors[role]}>{roleLabels[role] || role}</Tag>
            ),
        },
        {
            title: t("table.status"),
            key: "status",
            render: (_: unknown, record: IUser) => (
                record.is_active
                    ? <Tag color="green">{t("status.active")}</Tag>
                    : <Tag color="red">{t("status.inactive")}</Tag>
            ),
        },
        {
            title: t("table.actions"),
            key: "actions",
            width: 160,
            render: (_: unknown, record: IUser) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/users/${record.id}`)}
                    />
                    {record.is_active ? (
                        <Popconfirm
                            title={t("confirm.deactivateTitle")}
                            description={t("confirm.deactivateDescription")}
                            onConfirm={() => handleDeactivate(record.id)}
                            okText={t("confirm.deactivate")}
                            cancelText={t("confirm.cancel")}
                            okButtonProps={{danger: true}}
                        >
                            <Button type="text" danger icon={<LockOutlined />} />
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title={t("confirm.activateTitle")}
                            description={t("confirm.activateDescription")}
                            onConfirm={() => handleActivate(record.id)}
                            okText={t("confirm.activate")}
                            cancelText={t("confirm.cancel")}
                        >
                            <Button type="text" icon={<CheckOutlined />} style={{color: "green"}} />
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className={cls.filters}>
                <AppInput
                    placeholder={t("filters.fullName")}
                    value={filters.full_name__icontains || ""}
                    onChange={handleTextFilter("full_name__icontains")}
                    style={{width: 220}}
                    allowClear
                />
                <AppInput
                    placeholder={t("filters.studentCode")}
                    value={filters.student_code__icontains || ""}
                    onChange={handleTextFilter("student_code__icontains")}
                    style={{width: 180}}
                    allowClear
                />
                <Select
                    placeholder={t("filters.status")}
                    value={filters.is_active}
                    onChange={handleSelectFilter("is_active")}
                    allowClear
                    style={{width: 160}}
                    options={[
                        {value: "true", label: t("status.active")},
                        {value: "false", label: t("status.inactive")},
                    ]}
                />
                <Select
                    placeholder={t("filters.group")}
                    value={filters.group}
                    onChange={handleSelectFilter("group")}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    style={{width: 200}}
                    loading={groupsLoading}
                    onPopupScroll={handleGroupsPopupScroll}
                    options={groups.map((g) => ({value: g.id, label: g.name}))}
                />
                <Select
                    placeholder={t("filters.role")}
                    value={filters.role}
                    onChange={handleSelectFilter("role")}
                    allowClear
                    style={{width: 180}}
                    options={[
                        {value: "Student", label: t("roles.student")},
                        {value: "Teacher", label: t("roles.teacher")},
                        {value: "Admin", label: t("roles.admin")},
                    ]}
                />
            </div>
            <Table
                bordered
                className={cls.table}
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
                style={{marginTop: 16}}
            />
        </>
    );
});

const CreateUserForm = observer(() => {
    const {t} = useTranslation("users");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState<"Admin" | "Teacher">("Teacher");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const resetForm = () => {
        setFullName("");
        setEmail("");
        setPhone("");
        setRole("Teacher");
        setPassword("");
        setPasswordConfirm("");
    };

    const handleSubmit = async () => {
        if (password !== passwordConfirm) {
            message.error(t("messages.passwordMismatch"));
            return;
        }

        setSubmitting(true);

        const data: CreateUserRequest = {
            full_name: fullName,
            email,
            phone,
            role,
            password,
            password_confirm: passwordConfirm,
        };

        const success = await UserAdminStore.createUser(data);
        setSubmitting(false);

        if (success) {
            message.success(t("messages.created"));
            resetForm();
            UserAdminStore.fetchUsers();
        } else {
            message.error(t("messages.error"));
        }
    };

    const isValid = fullName.trim() && email.trim() && password && password === passwordConfirm;

    return (
        <div className={cls.formWrapper}>
            <Form layout="vertical" className={cls.form} onFinish={handleSubmit}>
                <Form.Item label={t("form.fullName")}>
                    <AppInput
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t("form.fullNamePlaceholder")}
                    />
                </Form.Item>
                <Form.Item label="Email">
                    <AppInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                    />
                </Form.Item>
                <Form.Item label={t("form.phone")}>
                    <AppInput
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+996 XXX XXX XXX"
                    />
                </Form.Item>
                <Form.Item label={t("form.role")}>
                    <Select
                        value={role}
                        onChange={setRole}
                        options={[
                            {value: "Teacher", label: t("roles.teacher")},
                            {value: "Admin", label: t("roles.admin")},
                        ]}
                    />
                </Form.Item>
                <Form.Item label={t("form.password")}>
                    <AppInput
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("form.passwordPlaceholder")}
                    />
                </Form.Item>
                <Form.Item label={t("form.passwordConfirm")}>
                    <AppInput
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder={t("form.passwordConfirmPlaceholder")}
                    />
                </Form.Item>
                <div className={cls.actions}>
                    <AppButton
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        disabled={!isValid}
                    >
                        {t("form.create")}
                    </AppButton>
                </div>
            </Form>
        </div>
    );
});

const UsersPage = observer(() => {
    const {t} = useTranslation("users");
    const tabItems = [
        {
            key: "list",
            label: t("tabs.list"),
            children: <UserList />,
        },
        {
            key: "create",
            label: t("tabs.create"),
            children: <CreateUserForm />,
        },
    ];

    return (
        <div className={cls.page}>
            <Tabs items={tabItems} />
        </div>
    );
});

export default UsersPage;
