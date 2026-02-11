import { observer } from "mobx-react-lite";
import cls from "./LoginPage.module.scss";
import {LoginForm} from "@/4_features/auth";

const LoginPage = observer(() => {

    return (
        <div className={cls.wrapper}>
            <div className={cls.card}>
                <h1 className={cls.title}>Вход</h1>
                <LoginForm />
            </div>
        </div>
    );
});

export default LoginPage;
