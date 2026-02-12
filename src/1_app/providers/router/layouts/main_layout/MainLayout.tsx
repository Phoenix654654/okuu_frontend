import {Suspense} from "react";
import {Sidebar} from "@/3_widgets/sidebar";
import {Header} from "@/3_widgets/headers";
import {Outlet} from "react-router-dom";
import {Spin} from "antd";
import cls from "./MainLayout.module.scss";

export const MainLayout = () => {
    return (
        <div className={cls.MainLayout}>
            <Sidebar />
            <div className={cls.Content}>
                <Header />
                <div className={cls.Page}>
                    <Suspense fallback={<Spin size="large" style={{display: "block", margin: "40px auto"}} />}>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

