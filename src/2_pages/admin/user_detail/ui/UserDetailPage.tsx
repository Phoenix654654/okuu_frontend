import {useEffect} from "react";
import {Card, Descriptions, Tag, Spin, message} from "antd";
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

    const handleBlock = async () => {
        if (!user) return;
        const success = await UserAdminStore.blockUser(user.id);
        if (success) {
            message.success("Пользователь заблокирован");
            UserAdminStore.fetchUser(user.id);
        }
    };

    const handleUnblock = async () => {
        if (!user) return;
        const success = await UserAdminStore.unblockUser(user.id);
        if (success) {
            message.success("Пользователь разблокирован");
            UserAdminStore.fetchUser(user.id);
        }
    };

    if (loading) {
        return <Spin size="large" style={{display: "block", margin: "40px auto"}} />;
    }

    if (!user) return null;

    const statusTag = user.blocked_at
        ? <Tag color="red">Заблокирован</Tag>
        : !user.is_active
            ? <Tag color="orange">Неактивен</Tag>
            : <Tag color="green">Активен</Tag>;

    return (
        <div className={cls.page}>
            <AppButton onClick={() => navigate(routes.adminUsers)}>
                ← Назад к списку
            </AppButton>
            <h1>{user.full_name}</h1>
            <Card>
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="ФИО">{user.full_name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                    <Descriptions.Item label="Телефон">{user.phone || "—"}</Descriptions.Item>
                    <Descriptions.Item label="Роль">
                        <Tag color={roleColors[user.role]}>{roleLabels[user.role] || user.role}</Tag>
                    </Descriptions.Item>
                    {user.student_code && (
                        <Descriptions.Item label="Код студента">
                            <Tag>{user.student_code}</Tag>
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Статус">{statusTag}</Descriptions.Item>
                    {user.blocked_at && (
                        <Descriptions.Item label="Заблокирован">
                            {new Date(user.blocked_at).toLocaleString("ru-RU")}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Дата регистрации">
                        {new Date(user.created_at).toLocaleDateString("ru-RU")}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            <div className={cls.actions}>
                {!user.is_active && (
                    <AppButton type="primary" onClick={handleActivate}>
                        Активировать
                    </AppButton>
                )}
                {user.blocked_at ? (
                    <AppButton onClick={handleUnblock}>
                        Разблокировать
                    </AppButton>
                ) : (
                    <AppButton danger onClick={handleBlock}>
                        Заблокировать
                    </AppButton>
                )}
            </div>
        </div>
    );
});

export default UserDetailPage;
