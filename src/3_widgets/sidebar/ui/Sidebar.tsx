import {Menu} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {UserStore} from "@/5_entities/user";
import cls from "./Sidebar.module.scss";
import {studentItems, teacherItems, adminItems, commonItems, LogoKNU} from "@/6_shared";


export const Sidebar = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = UserStore.currentUser$.value;
    const role = user?.role;

    const roleItems = role === "Admin" ? adminItems
        : role === "Teacher" ? teacherItems
        : role === "Student" ? studentItems
        : [];
    const menuItems = [...roleItems, ...commonItems];

    const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || "";

    return (
        <div className={cls.sidebar}>
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
                    onClick={({key}) => navigate(key)}
                />
            </div>
        </div>
    );
});
