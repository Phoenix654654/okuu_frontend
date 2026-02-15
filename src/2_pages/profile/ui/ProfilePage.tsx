import {useState, useEffect} from "react";
import {Avatar, Tag, Form, message, Select, Spin, Popconfirm} from "antd";
import {EditOutlined, MailOutlined, PhoneOutlined, TeamOutlined, CalendarOutlined, IdcardOutlined, SyncOutlined, LockOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {UserStore, userService} from "@/5_entities/user";
import {groupService} from "@/5_entities/group";
import type {IGroup} from "@/5_entities/group";
import {AppInput} from "@/6_shared/ui/input/AppInput";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import {roleLabels} from "@/6_shared";
import cls from "./ProfilePage.module.scss";

const ProfilePage = observer(() => {
    const user = UserStore.currentUser$.value;
    const [editing, setEditing] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [groupId, setGroupId] = useState<number | null>(null);
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [groupsLoading, setGroupsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changingCode, setChangingCode] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.full_name);
            setEmail(user.email);
            setPhone(user.phone);
            setGroupId(user.group?.id ?? null);
        }
    }, [user]);

    const loadGroups = async () => {
        setGroupsLoading(true);
        try {
            const res = await groupService.getList({limit: 100, offset: 0});
            setGroups(res.results);
        } catch {
            // ignore
        } finally {
            setGroupsLoading(false);
        }
    };

    const handleEdit = () => {
        setEditing(true);
        if (user?.role === "Student") {
            loadGroups();
        }
    };

    const handleCancel = () => {
        setEditing(false);
        if (user) {
            setFullName(user.full_name);
            setEmail(user.email);
            setPhone(user.phone);
            setGroupId(user.group?.id ?? null);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const data: Record<string, unknown> = {
                full_name: fullName,
                email,
                phone,
            };
            if (user.role === "Student") {
                data.group = groupId;
            }
            await userService.updateUser(user.id, data as Parameters<typeof userService.updateUser>[1]);
            await UserStore.fetchCurrentUser();
            message.success("Профиль обновлён");
            setEditing(false);
        } catch {
            message.error("Ошибка при обновлении");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!user) return;
        if (password !== passwordConfirm) {
            message.error("Пароли не совпадают");
            return;
        }
        setSavingPassword(true);
        try {
            await userService.changePassword(user.id, {password, password_confirm: passwordConfirm});
            message.success("Пароль успешно изменён");
            setPassword("");
            setPasswordConfirm("");
            setChangingPassword(false);
        } catch {
            message.error("Ошибка при смене пароля");
        } finally {
            setSavingPassword(false);
        }
    };

    const handleChangeStudentCode = async () => {
        if (!user) return;
        setChangingCode(true);
        try {
            await userService.changeStudentCode(user.id);
            await UserStore.fetchCurrentUser();
            message.success("Код студента обновлён");
        } catch {
            message.error("Ошибка при смене кода студента");
        } finally {
            setChangingCode(false);
        }
    };

    if (!user) return null;

    const initials = user.full_name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <div className={cls.page}>
            <div className={cls.header}>
                <Avatar size={80} className={cls.avatar}>
                    {initials}
                </Avatar>
                <div className={cls.headerInfo}>
                    <h1 className={cls.name}>{user.full_name}</h1>
                    <Tag color="blue" className={cls.roleTag}>
                        {roleLabels[user.role] || user.role}
                    </Tag>
                </div>
                {!editing && (
                    <AppButton
                        type="default"
                        icon={<EditOutlined />}
                        onClick={handleEdit}
                        className={cls.editBtn}
                    >
                        Редактировать
                    </AppButton>
                )}
            </div>

            {!editing ? (
                <div className={cls.card}>
                    <div className={cls.infoGrid}>
                        <InfoRow icon={<MailOutlined />} label="Email" value={user.email} />
                        <InfoRow icon={<PhoneOutlined />} label="Телефон" value={user.phone || "—"} />
                        {user.role === "Student" && (
                            <InfoRow
                                icon={<TeamOutlined />}
                                label="Группа"
                                value={user.group?.name || "Не указана"}
                            />
                        )}
                        {user.student_code && (
                            <div className={cls.infoRow}>
                                <span className={cls.infoIcon}><IdcardOutlined /></span>
                                <div className={cls.infoContent}>
                                    <span className={cls.infoLabel}>Код студента</span>
                                    <span className={cls.infoValue}>{user.student_code}</span>
                                </div>
                                <Popconfirm
                                    title="Сменить код студента?"
                                    description="Текущий код будет заменён на новый. Это действие нельзя отменить."
                                    onConfirm={handleChangeStudentCode}
                                    okText="Сменить"
                                    cancelText="Отмена"
                                    okButtonProps={{danger: true}}
                                >
                                    <AppButton
                                        type="default"
                                        size="small"
                                        icon={<SyncOutlined spin={changingCode} />}
                                        loading={changingCode}
                                        className={cls.changeCodeBtn}
                                    >
                                        Сменить
                                    </AppButton>
                                </Popconfirm>
                            </div>
                        )}
                        <InfoRow
                            icon={<CalendarOutlined />}
                            label="Дата регистрации"
                            value={new Date(user.created_at).toLocaleDateString("ru-RU")}
                        />
                    </div>
                </div>
            ) : (
                <div className={cls.card}>
                    <h2 className={cls.cardTitle}>Редактирование профиля</h2>
                    <Form layout="vertical" onFinish={handleSave} className={cls.form}>
                        <Form.Item label="ФИО">
                            <AppInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Email">
                            <AppInput value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Телефон">
                            <AppInput value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </Form.Item>
                        {user.role === "Student" && (
                            <Form.Item label="Группа">
                                <Select
                                    value={groupId}
                                    onChange={(val) => setGroupId(val)}
                                    placeholder="Выберите группу"
                                    allowClear
                                    loading={groupsLoading}
                                    notFoundContent={groupsLoading ? <Spin size="small" /> : "Нет групп"}
                                    options={groups.map((g) => ({
                                        value: g.id,
                                        label: g.name,
                                    }))}
                                />
                            </Form.Item>
                        )}
                        <div className={cls.actions}>
                            <AppButton onClick={handleCancel}>Отмена</AppButton>
                            <AppButton type="primary" htmlType="submit" loading={saving}>
                                Сохранить
                            </AppButton>
                        </div>
                    </Form>
                </div>
            )}

            <div className={cls.card}>
                <div className={cls.passwordHeader}>
                    <h2 className={cls.cardTitle}>Безопасность</h2>
                </div>
                {!changingPassword ? (
                    <div className={cls.infoRow}>
                        <span className={cls.infoIcon}><LockOutlined /></span>
                        <div className={cls.infoContent}>
                            <span className={cls.infoLabel}>Пароль</span>
                            <span className={cls.infoValue}>••••••••</span>
                        </div>
                        <AppButton
                            type="default"
                            size="small"
                            onClick={() => setChangingPassword(true)}
                            className={cls.changeCodeBtn}
                        >
                            Изменить
                        </AppButton>
                    </div>
                ) : (
                    <Form layout="vertical" onFinish={handleChangePassword} className={cls.form}>
                        <Form.Item label="Новый пароль">
                            <AppInput
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите новый пароль"
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
                            <AppButton onClick={() => {
                                setChangingPassword(false);
                                setPassword("");
                                setPasswordConfirm("");
                            }}>
                                Отмена
                            </AppButton>
                            <AppButton
                                type="primary"
                                htmlType="submit"
                                loading={savingPassword}
                                disabled={!password || !passwordConfirm}
                            >
                                Сохранить
                            </AppButton>
                        </div>
                    </Form>
                )}
            </div>
        </div>
    );
});

function InfoRow({icon, label, value}: {icon: React.ReactNode; label: string; value: string}) {
    return (
        <div className={cls.infoRow}>
            <span className={cls.infoIcon}>{icon}</span>
            <div className={cls.infoContent}>
                <span className={cls.infoLabel}>{label}</span>
                <span className={cls.infoValue}>{value}</span>
            </div>
        </div>
    );
}

export default ProfilePage;
