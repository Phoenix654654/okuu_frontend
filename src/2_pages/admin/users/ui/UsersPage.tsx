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
import {roleLabels, roleColors} from "@/6_shared";
import cls from "./UsersPage.module.scss";

const GROUPS_PAGE_SIZE = 30;

const UserList = observer(() => {
    const navigate = useNavigate();
    const {items, total, loading, page, pageSize, filters} = UserAdminStore.list$;
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [groupsTotal, setGroupsTotal] = useState(0);
    const [groupsOffset, setGroupsOffset] = useState(0);
    const [groupsLoading, setGroupsLoading] = useState(false);

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
        if (success) message.success("Пользователь активирован");
    };

    const handleDeactivate = async (id: number) => {
        const success = await UserAdminStore.deactivateUser(id);
        if (success) message.success("Пользователь деактивирован");
    };

    const columns = [
        {
            title: "ФИО",
            dataIndex: "full_name",
            key: "full_name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Код студента",
            dataIndex: "student_code",
            key: "student_code",
            render: (code: string) => code || "—",
        },
        {
            title: "Роль",
            dataIndex: "role",
            key: "role",
            render: (role: string) => (
                <Tag color={roleColors[role]}>{roleLabels[role] || role}</Tag>
            ),
        },
        {
            title: "Статус",
            key: "status",
            render: (_: unknown, record: IUser) => (
                record.is_active
                    ? <Tag color="green">Активен</Tag>
                    : <Tag color="red">Неактивен</Tag>
            ),
        },
        {
            title: "Действия",
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
                            title="Деактивировать пользователя?"
                            description="Пользователь не сможет войти в систему."
                            onConfirm={() => handleDeactivate(record.id)}
                            okText="Деактивировать"
                            cancelText="Отмена"
                            okButtonProps={{danger: true}}
                        >
                            <Button type="text" danger icon={<LockOutlined />} />
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title="Активировать пользователя?"
                            description="Пользователь сможет войти в систему."
                            onConfirm={() => handleActivate(record.id)}
                            okText="Активировать"
                            cancelText="Отмена"
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
                    placeholder="ФИО"
                    value={filters.full_name__icontains || ""}
                    onChange={handleTextFilter("full_name__icontains")}
                    style={{width: 220}}
                    allowClear
                />
                <AppInput
                    placeholder="Код студента"
                    value={filters.student_code__icontains || ""}
                    onChange={handleTextFilter("student_code__icontains")}
                    style={{width: 180}}
                    allowClear
                />
                <Select
                    placeholder="Статус"
                    value={filters.is_active}
                    onChange={handleSelectFilter("is_active")}
                    allowClear
                    style={{width: 160}}
                    options={[
                        {value: "true", label: "Активен"},
                        {value: "false", label: "Неактивен"},
                    ]}
                />
                <Select
                    placeholder="Группа"
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
                    placeholder="Роль"
                    value={filters.role}
                    onChange={handleSelectFilter("role")}
                    allowClear
                    style={{width: 180}}
                    options={[
                        {value: "Student", label: "Студент"},
                        {value: "Teacher", label: "Преподаватель"},
                        {value: "Admin", label: "Администратор"},
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
            message.error("Пароли не совпадают");
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
            message.success("Пользователь создан");
            resetForm();
            UserAdminStore.fetchUsers();
        } else {
            message.error("Произошла ошибка");
        }
    };

    const isValid = fullName.trim() && email.trim() && password && password === passwordConfirm;

    return (
        <div className={cls.formWrapper}>
            <Form layout="vertical" className={cls.form} onFinish={handleSubmit}>
                <Form.Item label="ФИО">
                    <AppInput
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Иванов Иван Иванович"
                    />
                </Form.Item>
                <Form.Item label="Email">
                    <AppInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                    />
                </Form.Item>
                <Form.Item label="Телефон">
                    <AppInput
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+996 XXX XXX XXX"
                    />
                </Form.Item>
                <Form.Item label="Роль">
                    <Select
                        value={role}
                        onChange={setRole}
                        options={[
                            {value: "Teacher", label: "Преподаватель"},
                            {value: "Admin", label: "Администратор"},
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Пароль">
                    <AppInput
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                    />
                </Form.Item>
                <Form.Item label="Подтверждение пароля">
                    <AppInput
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="Повторите пароль"
                    />
                </Form.Item>
                <div className={cls.actions}>
                    <AppButton
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        disabled={!isValid}
                    >
                        Создать
                    </AppButton>
                </div>
            </Form>
        </div>
    );
});

const UsersPage = observer(() => {
    const tabItems = [
        {
            key: "list",
            label: "Список пользователей",
            children: <UserList />,
        },
        {
            key: "create",
            label: "Создание пользователя",
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
