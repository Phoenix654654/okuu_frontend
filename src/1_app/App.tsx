import "./styles/index.scss";
import {Suspense, useEffect} from "react";
import {Spin} from "antd";
import {observer} from "mobx-react-lite";
import {AppRouter} from "@/1_app/providers/router";
import {UserStore} from "@/5_entities/user";
import {useTranslation} from "react-i18next";

const AppContent = observer(() => {
    useEffect(() => {
        UserStore.initAuthData();
    }, []);

    if (!UserStore.inited) {
        return <Spin size="large" fullscreen />;
    }

    return <AppRouter />;
});

const App = observer(() => {
    const {ready} = useTranslation();

    if (!ready) {
        return <Spin size="large" fullscreen />;
    }

    return (
        <Suspense fallback={<Spin size="large" />}>
            <AppContent />
        </Suspense>
    );
});

export default App;
