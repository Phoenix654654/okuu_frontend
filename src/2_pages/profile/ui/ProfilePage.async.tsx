import {lazy, Suspense} from "react";
import {Spin} from "antd";

const ProfilePageInner = lazy(() => import("./ProfilePage"));

export const ProfilePageAsync = () => {
    return (
        <Suspense fallback={<Spin size="large" />}>
            <ProfilePageInner />
        </Suspense>
    );
};

export default ProfilePageAsync;
