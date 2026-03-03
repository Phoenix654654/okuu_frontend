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
import {routes, roleColors, getRoleLabels} from "@/6_shared";
import {useTranslation} from "react-i18next";
import cls from "./UserDetailPage.module.scss";

const UserDetailPage = observer(() => {
    const {t} = useTranslation("userDetail");
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const {value: user, loading} = UserAdminStore.current$;
    const roleLabels = getRoleLabels();

    useEffect(() => {
        if (id) {
            UserAdminStore.fetchUser(Number(id));
        }
    }, [id]);

    const handleActivate = async () => {
        if (!user) return;
        const success = await UserAdminStore.activateUser(user.id);
        if (success) {
            message.success(t("messages.activated"));
            UserAdminStore.fetchUser(user.id);
        }
    };

    const handleDeactivate = async () => {
        if (!user) return;
        const success = await UserAdminStore.deactivateUser(user.id);
        if (success) {
            message.success(t("messages.deactivated"));
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
                <ArrowLeftOutlined /> {t("back")}
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
                            ? <Tag color="green">{t("status.active")}</Tag>
                            : <Tag color="red">{t("status.inactive")}</Tag>
                        }
                    </div>
                </div>
                <div className={cls.headerActions}>
                    {user.is_active ? (
                        <Popconfirm
                            title={t("confirm.deactivateTitle")}
                            description={t("confirm.deactivateDescription")}
                            onConfirm={handleDeactivate}
                            okText={t("confirm.deactivate")}
                            cancelText={t("confirm.cancel")}
                            okButtonProps={{danger: true}}
                        >
                            <AppButton danger icon={<StopOutlined />}>
                                {t("confirm.deactivate")}
                            </AppButton>
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title={t("confirm.activateTitle")}
                            description={t("confirm.activateDescription")}
                            onConfirm={handleActivate}
                            okText={t("confirm.activate")}
                            cancelText={t("confirm.cancel")}
                        >
                            <AppButton type="primary" icon={<CheckCircleOutlined />}>
                                {t("confirm.activate")}
                            </AppButton>
                        </Popconfirm>
                    )}
                </div>
            </div>

            <div className={cls.card}>
                <h2 className={cls.cardTitle}>{t("infoTitle")}</h2>
                <div className={cls.infoGrid}>
                    <InfoRow icon={<MailOutlined />} label="Email" value={user.email} />
                    <InfoRow icon={<PhoneOutlined />} label={t("labels.phone")} value={user.phone || "—"} />
                    {user.role === "Student" && (
                        <InfoRow
                            icon={<TeamOutlined />}
                            label={t("labels.group")}
                            value={user.group?.name || t("labels.notSpecified")}
                        />
                    )}
                    {user.student_code && (
                        <InfoRow icon={<IdcardOutlined />} label={t("labels.studentCode")} value={user.student_code} />
                    )}
                    <InfoRow
                        icon={<CalendarOutlined />}
                        label={t("labels.registrationDate")}
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
