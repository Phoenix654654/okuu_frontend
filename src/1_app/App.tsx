import "./styles/index.scss";
import {Suspense, useEffect} from "react";
import {Spin} from "antd";
import {observer} from "mobx-react-lite";
import {AppRouter} from "@/1_app/providers/router";
import {UserStore} from "@/5_entities/user";

const App = observer(() => {

    useEffect(() => {
        UserStore.initAuthData();
    }, []);

    if (!UserStore.inited) {
        return <Spin size="large" fullscreen />;
    }

    console.log(UserStore.currentUser$)

    return (
        <Suspense fallback={<Spin size="large" />}>
            <AppRouter />
        </Suspense>
    )
});

export default App
