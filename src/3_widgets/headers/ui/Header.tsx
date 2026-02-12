import {Button, Popconfirm} from "antd";
import {LogoutOutlined, BellOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {UserStore} from "@/5_entities/user";
import {routes, roleLabels} from "@/6_shared";
import cls from "./Header.module.scss";

export const Header = observer(() => {
    const navigate = useNavigate();
    const user = UserStore.currentUser$.value;

    const handleLogout = async () => {
        await UserStore.logout();
        navigate(routes.login);
    };

    return (
        <div className={cls.header}>
            <div className={cls.info}>
                {user && (
                    <span className={cls.pageTitle}>{roleLabels[user.role] || user.role}: {user.full_name}</span>
                )}
            </div>
            <div className={cls.actions}>
                <Button type="text" icon={<BellOutlined />} size={'large'}/>
                <Popconfirm
                    title="Выход"
                    description="Вы уверены, что хотите выйти?"
                    onConfirm={handleLogout}
                    okText="Да"
                    cancelText="Нет"
                >
                    <Button
                        size={'large'}
                        type="text"
                        icon={<LogoutOutlined />}
                    />
                </Popconfirm>
            </div>
        </div>
    );
});
