import {Menu} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {UserStore} from "@/5_entities/user";
import {classNames} from "@/6_shared/lib/classNames/classNames";
import cls from "./Sidebar.module.scss";
import {getStudentItems, getTeacherItems, getAdminItems, getCommonItems, LogoKNU} from "@/6_shared";
import {useEffect, useState} from "react";
import i18next from "i18next";


type SidebarProps = {
    variant?: "default" | "drawer";
    onNavigate?: () => void;
};

export const Sidebar = observer(({variant = "default", onNavigate}: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = UserStore.currentUser$.value;
    const role = user?.role;
    const [, forceUpdate] = useState({});

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

    return (
        <div className={classNames(cls.sidebar, {[cls.drawer]: variant === "drawer"})}>
            <div className={cls.logoSection}>
                <div className={cls.logoIcon}>
                    <img src={LogoKNU} alt="KNU"/>
                </div>
                <div className={cls.logoText}>OKUU</div>
            </div>

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
        </div>
    );
});
