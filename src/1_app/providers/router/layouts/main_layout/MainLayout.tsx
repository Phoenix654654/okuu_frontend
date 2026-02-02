import {Sidebar} from "@/3_widgets/sidebar";
import {Header} from "@/3_widgets/header";
import {Outlet} from "react-router-dom";
import cls from "./MainLayout.module.scss";
import {PageTitleProvider} from "@/6_shared";

export const MainLayout = () => {
    return (
        <PageTitleProvider>
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
        </PageTitleProvider>
    );
};

