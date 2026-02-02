import { Navigate } from "react-router-dom";
import UserStore from "@/5_entities/user/model/store/store.ts";
import { observer } from "mobx-react-lite";
import type {ReactNode} from "react";
import {Spin} from "antd";

interface ProtectedRouteProps {
    page: ReactNode;
    requiredPermission?: string[];
}

const ProtectedRoute = observer(({ page, requiredPermission }: ProtectedRouteProps) => {
    const { isAuth, inited, allPermissions$ } = UserStore;

    if (!inited) return <Spin />;

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    if (requiredPermission && !requiredPermission.some(p => allPermissions$.includes(p))) {
        return <Navigate to="/login" replace />;
    }

    return page;
});

export default ProtectedRoute;
