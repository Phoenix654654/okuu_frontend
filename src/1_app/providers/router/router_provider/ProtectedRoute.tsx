import { Navigate } from "react-router-dom";
import UserStore from "@/5_entities/user/model/store/store.ts";
import { observer } from "mobx-react-lite";
import type {ReactNode} from "react";
import {Spin} from "antd";

interface ProtectedRouteProps {
    page: ReactNode;
}

const ProtectedRoute = observer(({ page }: ProtectedRouteProps) => {
    const { isAuth, inited } = UserStore;

    if (!inited) return <Spin />;

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return page;
});

export default ProtectedRoute;
