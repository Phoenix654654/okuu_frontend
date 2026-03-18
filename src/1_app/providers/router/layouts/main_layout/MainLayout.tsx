import {Suspense, useEffect, useState} from "react";
import {Sidebar} from "@/3_widgets/sidebar";
import {Header} from "@/3_widgets/headers";
import {Outlet} from "react-router-dom";
import {Drawer, Spin} from "antd";
import {useMediaQuery} from "@/6_shared/lib/hooks/useMediaQuery/useMediaQuery";
import cls from "./MainLayout.module.scss";

export const MainLayout = () => {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isMobile) setSidebarOpen(false);
    }, [isMobile]);

    return (
        <div className={cls.MainLayout}>
            {isMobile ? (
                <Drawer
                    open={sidebarOpen}
                    placement="left"
                    onClose={() => setSidebarOpen(false)}
                    width={320}
                    styles={{body: {padding: 0}}}
                >
                    <Sidebar variant="drawer" onNavigate={() => setSidebarOpen(false)} />
                </Drawer>
            ) : (
                <Sidebar />
            )}
            <div className={cls.Content}>
                <Header showMenuButton={isMobile} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
                <div className={cls.Page}>
                    <Suspense fallback={<Spin size="large" style={{display: "block", margin: "40px auto"}} />}>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

