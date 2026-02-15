import {useEffect} from "react";
import {Avatar, Tag, Spin, message, Popconfirm} from "antd";
import {
    ArrowLeftOutlined,
    MailOutlined,
    PhoneOutlined,
    IdcardOutlined,
    CalendarOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    StopOutlined,
} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useParams, useNavigate} from "react-router-dom";
import {UserAdminStore} from "@/5_entities/user";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import {routes, roleLabels, roleColors} from "@/6_shared";
import cls from "./UserDetailPage.module.scss";

const UserDetailPage = observer(() => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const {value: user, loading} = UserAdminStore.current$;

    useEffect(() => {
        if (id) {
            UserAdminStore.fetchUser(Number(id));
        }
    }, [id]);

    const handleActivate = async () => {
        if (!user) return;
        const success = await UserAdminStore.activateUser(user.id);
        if (success) {
            message.success("Пользователь активирован");
            UserAdminStore.fetchUser(user.id);
        }
    };

    const handleDeactivate = async () => {
        if (!user) return;
        const success = await UserAdminStore.deactivateUser(user.id);
        if (success) {
            message.success("Пользователь деактивирован");
            UserAdminStore.fetchUser(user.id);
        }
    };

    if (loading) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    if (!user) return null;

    const initials = user.full_name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <div className={cls.page}>
            <button className={cls.backBtn} onClick={() => navigate(routes.adminUsers)}>
                <ArrowLeftOutlined /> Назад к списку
            </button>

            <div className={cls.header}>
                <Avatar size={72} className={cls.avatar}>
                    {initials}
                </Avatar>
                <div className={cls.headerInfo}>
                    <h1 className={cls.name}>{user.full_name}</h1>
                    <div className={cls.headerTags}>
                        <Tag color={roleColors[user.role]}>{roleLabels[user.role] || user.role}</Tag>
                        {user.is_active
                            ? <Tag color="green">Активен</Tag>
                            : <Tag color="red">Неактивен</Tag>
                        }
                    </div>
                </div>
                <div className={cls.headerActions}>
                    {user.is_active ? (
                        <Popconfirm
                            title="Деактивировать пользователя?"
                            description="Пользователь не сможет войти в систему."
                            onConfirm={handleDeactivate}
                            okText="Деактивировать"
                            cancelText="Отмена"
                            okButtonProps={{danger: true}}
                        >
                            <AppButton danger icon={<StopOutlined />}>
                                Деактивировать
                            </AppButton>
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title="Активировать пользователя?"
                            description="Пользователь сможет войти в систему."
                            onConfirm={handleActivate}
                            okText="Активировать"
                            cancelText="Отмена"
                        >
                            <AppButton type="primary" icon={<CheckCircleOutlined />}>
                                Активировать
                            </AppButton>
                        </Popconfirm>
                    )}
                </div>
            </div>

            <div className={cls.card}>
                <h2 className={cls.cardTitle}>Информация</h2>
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
                        <InfoRow icon={<IdcardOutlined />} label="Код студента" value={user.student_code} />
                    )}
                    <InfoRow
                        icon={<CalendarOutlined />}
                        label="Дата регистрации"
                        value={new Date(user.created_at).toLocaleDateString("ru-RU")}
                    />
                </div>
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

export default UserDetailPage;
