import {Sidebar} from "@/3_widgets/sidebar";
import {Header} from "@/3_widgets/headers";
import {Outlet} from "react-router-dom";
import cls from "./MainLayout.module.scss";

export const MainLayout = () => {
    return (
        <div className={cls.MainLayout}>
            <Sidebar />
            <div className={cls.Content}>
                <Header />
                <div className={cls.Page}>
                    <Outlet />
                </div>
                <div></div>
            </div>
        </div>
    );
};

