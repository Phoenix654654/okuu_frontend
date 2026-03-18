import {Suspense, useEffect, useState} from "react";
import {Sidebar} from "@/3_widgets/sidebar";
import {Header} from "@/3_widgets/headers";
import {Outlet} from "react-router-dom";
import {Drawer, Spin} from "antd";
import {useMediaQuery} from "@/6_shared/lib/hooks/useMediaQuery/useMediaQuery";
import {CloseOutlined} from "@ant-design/icons";
import {LogoKNU} from "@/6_shared";
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
                    title={
                        <div style={{display: "flex", alignItems: "center", gap: 10, marginTop: -2}}>
                            <span
                                aria-hidden
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.15)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img src={LogoKNU} alt="" style={{width: 22, height: 22}} />
                            </span>
                            <span style={{color: "var(--accent-yellow)", fontWeight: 600, letterSpacing: 0.5}}>
                                OKUU
                            </span>
                        </div>
                    }
                    closeIcon={<CloseOutlined style={{color: "#fff"}} />}
                    styles={{
                        header: {
                            background: "var(--sidebar-bg-start)",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        },
                        body: {padding: 0},
                    }}
                >
                    <Sidebar variant="drawer" showLogoSection={false} onNavigate={() => setSidebarOpen(false)} />
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

