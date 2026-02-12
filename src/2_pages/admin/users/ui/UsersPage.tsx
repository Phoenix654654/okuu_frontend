import {useEffect, useCallback, useState} from "react";
import {Table, Tag, Space, Button, Select, Popconfirm, message, Tabs, Form} from "antd";
import {EyeOutlined, CheckOutlined, LockOutlined, UnlockOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {UserAdminStore} from "@/5_entities/user";
import type {IUser, CreateUserRequest} from "@/5_entities/user";
import {AppPagination} from "@/6_shared/ui/pagination/AppPagination";
import {AppInput} from "@/6_shared/ui/input/AppInput";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import {useDebounce} from "@/6_shared/lib/hooks/useDebounce/useDebounce";
import {roleLabels, roleColors} from "@/6_shared";
import cls from "./UsersPage.module.scss";

const UserList = observer(() => {
    const navigate = useNavigate();
    const {items, total, loading, page, pageSize, filters} = UserAdminStore.list$;

    useEffect(() => {
        UserAdminStore.fetchUsers();
    }, []);

    const debouncedFetch = useDebounce(() => {
        UserAdminStore.fetchUsers();
    }, 500);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        UserAdminStore.list$.setFilter("search", e.target.value || undefined);
        debouncedFetch();
    }, [debouncedFetch]);

    const handleRoleChange = (value: string | undefined) => {
        UserAdminStore.list$.setFilter("role", value);
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

    const handleBlock = async (id: number) => {
        const success = await UserAdminStore.blockUser(id);
        if (success) message.success("Пользователь заблокирован");
    };

    const handleUnblock = async (id: number) => {
        const success = await UserAdminStore.unblockUser(id);
        if (success) message.success("Пользователь разблокирован");
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
            render: (_: unknown, record: IUser) => {
                if (record.blocked_at) return <Tag color="red">Заблокирован</Tag>;
                if (!record.is_active) return <Tag color="orange">Неактивен</Tag>;
                return <Tag color="green">Активен</Tag>;
            },
        },
        {
            title: "Дата регистрации",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => new Date(date).toLocaleDateString("ru-RU"),
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
                    {!record.is_active && (
                        <Popconfirm
                            title="Активировать пользователя?"
                            onConfirm={() => handleActivate(record.id)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button type="text" icon={<CheckOutlined />} style={{color: "green"}} />
                        </Popconfirm>
                    )}
                    {record.blocked_at ? (
                        <Popconfirm
                            title="Разблокировать пользователя?"
                            onConfirm={() => handleUnblock(record.id)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button type="text" icon={<UnlockOutlined />} style={{color: "green"}} />
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title="Заблокировать пользователя?"
                            onConfirm={() => handleBlock(record.id)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button type="text" danger icon={<LockOutlined />} />
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
                    placeholder="Поиск по имени..."
                    value={filters.search || ""}
                    onChange={handleSearchChange}
                    style={{width: 300}}
                    allowClear
                />
                <Select
                    placeholder="Роль"
                    value={filters.role}
                    onChange={handleRoleChange}
                    allowClear
                    style={{width: 200}}
                    options={[
                        {value: "Student", label: "Студент"},
                        {value: "Teacher", label: "Преподаватель"},
                        {value: "Admin", label: "Администратор"},
                    ]}
                />
            </div>
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
