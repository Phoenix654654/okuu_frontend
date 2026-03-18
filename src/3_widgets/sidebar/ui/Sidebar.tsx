import {Button, Menu, Popconfirm} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {LogoutOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {UserStore} from "@/5_entities/user";
import {classNames} from "@/6_shared/lib/classNames/classNames";
import cls from "./Sidebar.module.scss";
import {getStudentItems, getTeacherItems, getAdminItems, getCommonItems, LogoKNU, getRoleLabels, routes} from "@/6_shared";
import {useEffect, useState} from "react";
import i18next from "i18next";
import {useTranslation} from "react-i18next";


type SidebarProps = {
    variant?: "default" | "drawer";
    onNavigate?: () => void;
    showLogoSection?: boolean;
};

export const Sidebar = observer(({variant = "default", onNavigate, showLogoSection = true}: SidebarProps) => {
    const {t} = useTranslation("layout");
    const navigate = useNavigate();
    const location = useLocation();
    const user = UserStore.currentUser$.value;
    const role = user?.role;
    const [, forceUpdate] = useState({});
    const roleLabels = getRoleLabels();

    useEffect(() => {
        const handleLanguageChanged = () => forceUpdate({});
        i18next.on('languageChanged', handleLanguageChanged);
        return () => {
            i18next.off('languageChanged', handleLanguageChanged);
        };
    }, []);

    const roleItems = role === "Admin" ? getAdminItems()
        : role === "Teacher" ? getTeacherItems()
        : role === "Student" ? getStudentItems()
        : [];
    const menuItems = [...roleItems, ...getCommonItems()];

    const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || "";

    const userTitle = user?.full_name || user?.email || "";
    const roleText = role ? (roleLabels[role as keyof typeof roleLabels] || role) : "";
    const userSubtitle = [roleText, user?.student_code].filter(Boolean).join(" · ");
    const userInitial = (userTitle.trim()[0] || "?").toUpperCase();

    const handleLogout = async () => {
        await UserStore.logout();
        navigate(routes.login);
        onNavigate?.();
    };

    return (
        <div className={classNames(cls.sidebar, {[cls.drawer]: variant === "drawer"})}>
            {showLogoSection && (
                <div className={cls.logoSection}>
                    <div className={cls.logoIcon}>
                        <img src={LogoKNU} alt="KNU"/>
                    </div>
                    <div className={cls.logoText}>OKUU</div>
                </div>
            )}

            <div className={cls.menuWrapper}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    onClick={({key}) => {
                        navigate(key);
                        onNavigate?.();
                    }}
                />
            </div>

            {user && (
                <div className={cls.userSection}>
                    <div className={cls.userAvatar} aria-hidden>
                        {userInitial}
                    </div>
                    <div className={cls.userInfo}>
                        <div className={cls.userNameBottom} title={userTitle}>{userTitle}</div>
                        {userSubtitle && <div className={cls.userRole} title={userSubtitle}>{userSubtitle}</div>}
                    </div>
                    <Popconfirm
                        title={t("header.logout")}
                        description={t("header.logoutConfirm")}
                        onConfirm={handleLogout}
                        okText={t("header.yes")}
                        cancelText={t("header.no")}
                    >
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            className={cls.logoutBtn}
                            aria-label={t("header.logout")}
                        />
                    </Popconfirm>
                </div>
            )}
        </div>
    );
});
