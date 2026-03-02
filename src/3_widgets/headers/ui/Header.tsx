import {Button, Popconfirm} from "antd";
import {LogoutOutlined, BellOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {UserStore} from "@/5_entities/user";
import {routes, getRoleLabels} from "@/6_shared";
import {LanguageSwitcher} from "@/6_shared/ui/language-switcher";
import cls from "./Header.module.scss";

export const Header = observer(() => {
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();
    const user = UserStore.currentUser$.value;
    const roleLabels = getRoleLabels();

    const handleLogout = async () => {
        await UserStore.logout();
        navigate(routes.login);
    };

    return (
        <div className={cls.header}>
            <div className={cls.info}>
                {user && (
                    <span className={cls.pageTitle}>{roleLabels[user.role as keyof typeof roleLabels] || user.role}: {user.full_name}</span>
                )}
                {user && user.student_code && (
                    <span className={cls.studentCode}>{t("header.studentCode", {code: user.student_code})}</span>
                )}
            </div>
            <div className={cls.actions}>
                <LanguageSwitcher />
                <Button type="text" icon={<BellOutlined />} size={'large'} aria-label={t("header.notifications")}/>
                <Popconfirm
                    title={t("header.logout")}
                    description={t("header.logoutConfirm")}
                    onConfirm={handleLogout}
                    okText={t("header.yes")}
                    cancelText={t("header.no")}
                >
                    <Button
                        size={'large'}
                        type="text"
                        icon={<LogoutOutlined />}
                        aria-label={t("header.logout")}
                    />
                </Popconfirm>
            </div>
        </div>
    );
});
